'use server'

import { AzureOpenAI } from "openai"
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity"

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
  /

}
export default transcript;