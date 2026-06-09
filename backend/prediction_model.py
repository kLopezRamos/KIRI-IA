from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
import torch

class LocalIdentifier:

    def __init__(self):
        print("Cargando Florence-2")
   

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Dispositivo detectado: {self.device}")

        self.processor = AutoProcessor.from_pretrained(
            "microsoft/Florence-2-base",
            trust_remote_code=True
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            "microsoft/Florence-2-base",
            trust_remote_code=True
        )

        self.model.to(self.device)
        self.model.eval()
        print(" Florence-2 configurado correctamente")

    def predict(self, image_file):
        try:
            image = Image.open(image_file).convert("RGB")

            width, height = image.size
            new_edge = min(width, height)
            left = (width - new_edge) / 2
            top = (height - new_edge) / 2
            right = (width + new_edge) / 2
            bottom = (height + new_edge) / 2

            image = image.crop((left, top, right, bottom))
            prompt = "<OD>"

            inputs = self.processor(
                text=prompt,
                images=image,
                return_tensors="pt"
            )

            inputs = {
                key: value.to(self.device)
                for key, value in inputs.items()
            }

            with torch.no_grad():
                generated_ids = self.model.generate(
                   input_ids=inputs["input_ids"],
                    pixel_values=inputs["pixel_values"],
                    max_new_tokens=1024,
                    num_beams=5,       
                    early_stopping=True, 
                    do_sample=False
                )

            generated_text = self.processor.batch_decode(
                generated_ids,
                skip_special_tokens=False
            )[0]

            parsed_answer = self.processor.post_process_generation(
                generated_text,
                task=prompt,
                image_size=(image.width, image.height)
            )

            detections = parsed_answer[prompt]
            print(f"Estructura detectada completa: {detections}")

            if detections and "labels" in detections and len(detections["labels"]) > 0:
                object_name = detections["labels"][0]
                
                object_name = object_name.strip().lower()
                
                print(f" Objeto principal extraído: {object_name}")
                return object_name

        except Exception as e:
            print("ERROR EN MODO OD")
            print(str(e))

        return "object"