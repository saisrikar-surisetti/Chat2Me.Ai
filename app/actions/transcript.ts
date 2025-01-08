'use server'
import { AzureKeyCredential } from "@azure/core-auth";
import OpenAI, { AzureOpenAI } from "openai"
import { AzureCliCredential, AzureDeveloperCliCredential, DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity"
import { createReadStream } from "fs";
import { ChatRequestMessage, OpenAIClient } from "@azure/openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

async function transcript(prevState: any, formData: FormData) {
  console.log("PREVIOUS STATE:", prevState); 

  const id = Math.random().toString(36)


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

  const result1 = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );
  console.log(`Transcription: ${result1.text}`);

  const openai = new OpenAI();
  
  const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [

        {
          role: "system",
          content: "You are a very helpful human assistant. You will answer questions and if you can't reply, you say that you dont know the awnser. "
        },
        {role: "user",
          content: result1.text,
        },
        ],
        
  });
  
  console.log(response.choices[0].message.content);
  return{
    sender: result1.text,
    response: response,
    id,  
  }
//   const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const prompt ="You are a helpful assitant. Respond to the question  and if you cannot respond, say you don't know"
// const result = await model1.generateContent([prompt, result1.text]);
// console.log(result.response.text());
  
  // const messages: ChatCompletionCreateParamsNonStreaming[] = [

  // {
  //   role: "system",
  //   content: "You are a very helpful human assistant. You will answer questions and if you can't reply, you say that you dont know the awnser. "
  // },
  // {role: "user",
  //   content: result.text,
  // },
  // ]
// const depolyName = process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME
  
// const completions = await client.chat.completions.create({ messages, hh, jjj})

// const response = completions.choices[0].message?.content;

// console.log(prevState, "+++", result.text)


}

  



  
  
 


export default transcript;