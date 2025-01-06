'use client'
import Image from "next/image";
import { SettingsIcon } from "lucide-react";
import Messages from "./components/messages";
import Recorder, { mimeType } from "./components/recorder";
import { useActionState, useRef } from "react";
import { useFormState } from "react-dom";
import transcript from "@/app/actions/transcript";
import { redirect } from "next/navigation";

const initialState = {
  sender: "",
  response: "",
  id:"",
}

export default function Home() {
const fileRef = useRef<HTMLInputElement | null >(null) ;
const submitButtonRef= useRef<HTMLButtonElement | null>(null) ;
const [state, formAction] = useActionState(transcript, initialState)

const uploadAudio = (blob: Blob ) => {


const file = new File([blob],"audio.webm", {type: mimeType })

//set the file as the value of the hidden file input feild 
if (fileRef.current){
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
 fileRef.current.files = dataTransfer.files

 //simulate click
 if (submitButtonRef.current){
  submitButtonRef.current.click()
 }

}
}

const clickHandler = ()=> {
  redirect('/tasks')
}
  return (  

    <div className="bg-black h-screen overflow-y-auto">
     {/* header */}
     <header className="flex justify-between fixed text-white p-5 w-full"> 
     <Image
      src="https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
      height={50}
      width={50}
      alt="logo"
      className="object-contain rounded-full"
      />
    <SettingsIcon
    size={40}
    className="p-2 m-2 rounded-full hover:cursor-pointer bg-purple-600 text-black transition-all ease-in-out duration-150 hover:text-white"
    onClick={clickHandler}
    />
     </header>
     
     {/* form */}
    <form action={formAction} className="flex flex-col bg-black ">
    <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
   <Messages/>
    </div>
    <input name="audio" type="file" hidden ref={fileRef} />
    <button type="submit" hidden ref={submitButtonRef}/>
    <div className="fixed bottom-0 w-full overflow-hidden rounded-3xl">
      <Recorder  uploadAudio={uploadAudio}/>
      {/* voice synthesiser */}
      <div>

      </div>
    </div>
    </form>    

    </div>


  );
}
