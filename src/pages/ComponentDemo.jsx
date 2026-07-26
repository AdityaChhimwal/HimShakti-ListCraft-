import { useState } from "react";
import { Button, Input, Loader, Modal, showToast } from "../components/ui";
import { Toaster } from "react-hot-toast";

function ComponentDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen p-10 space-y-8">

      <Toaster />

      <h1 className="text-4xl font-bold">
        UI Component Showcase
      </h1>

      <div className="space-x-4">

        <Button variant="primary">
          Primary
        </Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="outline">
          Outline
        </Button>

      </div>

      <Input
        label="Product Name"
        placeholder="Millet Cookies"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />

      <Button
        onClick={()=>setModalOpen(true)}
      >
        Open Modal
      </Button>

      <Button
        onClick={()=>showToast("Toast Working!")}
      >
        Show Toast
      </Button>

      <Loader />

      <Modal
        isOpen={modalOpen}
        onClose={()=>setModalOpen(false)}
        title="Demo Modal"
      >
        Modal is working.
      </Modal>

    </div>
  );
}

export default ComponentDemo;