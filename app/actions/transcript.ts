'use server'
import { AzureKeyCredential } from "@azure/core-auth";
import OpenAI, { AzureOpenAI } from "openai"
import { AzureCliCredential, AzureDeveloperCliCredential, DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity"
import { createReadStream } from "fs";
import { ChatRequestMessage, OpenAIClient } from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  console.log("PREVIOUS STATE:", prevState); 

  if (
    process.env.AZURE_OPENAI_API_KEY === undefined || 
    process.env.AZURE_OPENAI_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
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

  const client = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
  );

  const result = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );
  console.log(`Transcription: ${result.text}`);
  
  const messages: ChatRequestMessage[] = [

  {
    role: "system",
    content: "You are a very helpful human assistant. You will answer questions and if you can't reply, you say that you dont know the awnser. "
  },
  {role: "user",
    content: result.text,
  },
  ]

const completions = await client.getChatCompletions(
  process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
  messages,
  {maxTokens: 128}
)

const response = completions.choices[0].message?.content;

console.log(prevState, "+++", result.text)


}

  



  
  
 


export default transcript;