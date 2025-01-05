'use server'
import { AzureKeyCredential } from "@azure/core-auth";
import OpenAI, { AzureOpenAI } from "openai"
import { AzureCliCredential, AzureDeveloperCliCredential, DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity"

async function transcript(prevState: any, formData: FormData) {
  console.log("PREVIOUS STATE:", prevState); 

  if (
    process.env.AZURE_API_KEY === undefined || 
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENY_NAME === undefined ||
    process.env.AZURE_DEPLOMENT_COMPLETIONS_MAME === undefined
  ) {
    console.error("Azure credentials not set",)
    return {
      sender: "", 
      response: "Azure credentials not set",
  };
  }
  const file = formData.get("audio") as File; 

  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }
  console.log(">", file); 

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer)
  

  //get audio transcription
  console.log("== Transcribe Audio sample ==")


  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";

  const client = new AzureOpenAI({ endpoint, apiKey});

  const result = await client.audio.transcriptions.create(
    process.env.AZURE_DEPOLYMENT_NAME, 
  )


  



  
  
 

}
export default transcript;