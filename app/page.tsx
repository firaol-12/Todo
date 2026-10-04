"use client";

import Image from "next/image";
import img from "./asset/plus (1).png";
import img2 from "./asset/delete.png";
import img3 from "./asset/pen.png";

import { useEffect, useState } from "react";

type User = {
  id: number;
  data: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);


  // GET
  useEffect(() => {
    async function getUsers() {
      const response = await fetch("/api/items");

      const data = await response.json();

      setUsers(data);
    }

    getUsers();
  }, []);


  // POST
  const SendData = async () => {
    const response = await fetch("/api/items", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        item: text,
      }),
    });

    if (!response.ok) {
      console.log("Failed to save item");
      return;
    }

    const getResponse = await fetch("/api/items");

    if (!getResponse.ok) {
      console.log("Failed to get items");
      return;
    }

    const data = await getResponse.json();

    setUsers(data);

    setText("");
  };

  const startEdit = (item: User) => {
    setText(item.data);
    setEditingId(item.id);
  };

  // PUT
  const UpdateData = async () => {
    if (editingId === null) {
      return;
    }

    const response = await fetch("/api/items", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: editingId,
        item: text,
      }),
    });

    if (!response.ok) {
      console.log("Failed to update item");
      return;
    }

    const data = await response.json();

    console.log("Updated item:", data);

    const getResponse = await fetch("/api/items");

    const users = await getResponse.json();

    setUsers(users);

    setText("");
    setEditingId(null);
  };


  // DELETE
  const DeleteData = async (id: number) => {
    const response = await fetch(`/api/items?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.log("Failed to delete item");
      return;
    }

    const getResponse = await fetch("/api/items");

    const data = await getResponse.json();

    setUsers(data);
  };


  return (
    <div className="bg-gray-200 flex flex-col justify-around items-center h-screen w-full">

      <div>
        <h1 className="eagle text-orange-500 text-4xl">
          yaayoo
        </h1>
      </div>


      <div className="bg-gray-100 overflow-y-scroll shadow-xl flex flex-col justify-start items-center w-3/5 px-10 pt-5 pb-5 h-120 border-2 border-gray-300 rounded-2xl">

        {users.map((item, index) => (

          <div
            key={item.id}
            className="border-b mb-2 flex justify-start gap-7 items-center border-gray-300 w-full"
          >

            <div className="py-1 flex justify-center items-center gap-3">

              <div className="w-10">
                <p className="text-gray-700">
                  {index + 1}
                </p>
              </div>


              {/* DELETE */}
              <button onClick={() => DeleteData(item.id)}>
                <Image
                  src={img2}
                  alt="delete"
                  width={25}
                  height={25}
                />
              </button>


              {/* UPDATE */}
              <button onClick={() => startEdit(item)}>
                <Image
                  src={img3}
                  alt="edit"
                  width={25}
                  height={25}
                />
              </button>

            </div>


            <div className="w-80 flex justify-start items-start">
              <p className="text-gray-700 text-xl">
                {item.data}
              </p>
            </div>

          </div>

        ))}

      </div>


      <div className="flex justify-center items-center bg-gray-100 gap-5 shadow-xl w-3/5 h-20 border-2 border-gray-300 rounded-2xl">

        <div className="text-black">

          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="focus:outline-none border border-gray-300 rounded-xl px-5 py-2 w-190"
            type="text"
            placeholder="type here ..."
          />

        </div>


        {/* POST or PUT, depending on editingId */}

        <div className="w-10 h-10 text-white bg-orange-500 rounded-xl flex justify-center items-center">

          <button
            onClick={() => (editingId === null ? SendData() : UpdateData())}
          >

            <Image
              src={img}
              alt="Plus"
              width={20}
              height={20}
            />

          </button>

        </div>

      </div>

    </div>
  );
}