"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ title, description, action, trigger }: { title: string; description: string; action: () => Promise<void>; trigger: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="menu-danger" type="button" onClick={() => ref.current?.showModal()}>{trigger}</button>
      <dialog className="confirm-dialog" ref={ref} onClick={(event) => { if (event.target === ref.current) ref.current.close(); }}>
        <div className="confirm-dialog-content"><span className="dialog-kicker">Please confirm</span><h2>{title}</h2><p>{description}</p><div className="dialog-actions"><Button variant="secondary" type="button" onClick={() => ref.current?.close()}>Keep trip</Button><form action={action}><Button variant="danger" type="submit">Delete permanently</Button></form></div></div>
      </dialog>
    </>
  );
}
