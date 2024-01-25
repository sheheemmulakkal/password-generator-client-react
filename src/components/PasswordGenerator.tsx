import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function PasswordGenerator() {
  const [password, setPassword] = useState<string>();
  const [mail, setMail] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [length, setLength] = useState<number>(10);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [symbols, setSymbols] = useState<boolean>(false);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [lowercase, setLowercase] = useState<boolean>(false);
  //   console.log(length, "ke");

  const handleLengthChange = (inputLength: string) => {
    console.log(inputLength);
    setLength(Number(inputLength));
    generatePassword();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password!);
    setStatus(true);
    setTimeout(() => {
      setStatus(false);
    }, 2000);
  };
  const handleCheckboxChange = (checkboxName: string) => {
    switch (checkboxName) {
      case "uppercase":
        setUppercase(!uppercase);
        break;
      case "lowercase":
        setLowercase(!lowercase);
        break;
      case "numbers":
        setNumbers(!numbers);
        break;
      case "symbols":
        setSymbols(!symbols);
        break;
      default:
        break;
    }
    generatePassword();
  };

  const handleClick = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    modal.show();
  };

  const generatePassword = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/generate-password",
        { length, numbers, symbols, uppercase, lowercase }
      );
      setPassword(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [length, numbers, symbols, uppercase, lowercase]);

  const sendMail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mail.trim() !== "" && emailRegex.test(mail)) {
      await axios.post("http://localhost:3000/send-mail", {
        email: mail,
        password,
      });
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
        setMail("");
      }, 2000);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);
  return (
    <div className="py-4 bg-white min-w-[40%] rounded-sm shadow-lg border ">
      <h2 className="font-bold text-3xl text-[#544D93] py-4">
        Generate password
      </h2>

      <div className="w-full py-3">
        <input
          type="text"
          value={password}
          disabled
          className="border bg-white px-3 rounded-sm w-4/6 my-3 py-2 text-emerald-950"
        />
        <div className="w-full justify-center flex gap-4 flex-row">
          <input
            type="range"
            defaultValue={10}
            min={5}
            max={20}
            onChange={(e) => handleLengthChange(e.target.value)}
            className="range accent-[#544D93] w-3/6 bg-white text-gray-950 "
          />
          <h5>{length}</h5>
        </div>
      </div>
      <div className="w-full flex justify-center py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 font-semibold accent-[#544D93] w-4/6">
          <div className="w-full flex flex-row justify-between px-3 py-2">
            <label htmlFor="uppercase"> Upper Case</label>
            <input
              className="bg-white"
              type="checkbox"
              name="uppercase"
              id="uppercase"
              value={"uppercase"}
              checked={uppercase}
              onChange={() => handleCheckboxChange("uppercase")}
            />
          </div>
          <div className="flex flex-row justify-between px-3 py-2">
            <label htmlFor="lowercase"> Lower Case</label>
            <input
              className="bg-white"
              type="checkbox"
              name="lowercase"
              id="lowercase"
              value={"lowercase"}
              checked={lowercase}
              onChange={() => handleCheckboxChange("lowercase")}
            />
          </div>
          <div className="flex flex-row justify-between px-3 py-2">
            <label htmlFor="numbers"> Numbers</label>
            <input
              className="bg-white"
              type="checkbox"
              name="numbers"
              id="numbers"
              value={"numbers"}
              checked={numbers}
              onChange={() => handleCheckboxChange("numbers")}
            />
          </div>
          <div className="flex flex-row justify-between px-3 py-2">
            <label htmlFor="symbols"> Symbols</label>
            <input
              className="bg-white"
              type="checkbox"
              name="symbols"
              id="symbols"
              value={"symbols"}
              checked={symbols}
              onChange={() => handleCheckboxChange("symbols")}
            />
          </div>
          <div className="col-span-2 pt-8">
            {/* <button className="bg-[#544D93] text-white px-5 py-3 font-semibold">
              Send to Email
            </button> */}
            <button
              className="btn bg-[#544D93] text-white font-semibold text-lg rounded-sm border-none w-full"
              onClick={() => handleClick()}
            >
              Get password
            </button>
            <dialog id="my_modal_2" className="modal bg-[#00000070]">
              <div className="modal-box bg-white w-full flex flex-col justify-center ">
                <div className=" w-full flex justify-center pt-5">
                  <div className="w-10/12">
                    <button
                      disabled={status}
                      className={
                        !status
                          ? "bg-[#544D93] text-[#ffffff] font-semibold rounded-sm text-lg px-4 w-full py-1 hover:underline"
                          : "bg-[#544D93] text-[#ffffff6e] font-semibold rounded-sm text-lg px-4 w-full py-1 cursor-not-allowed"
                      }
                      onClick={copyToClipboard}
                    >
                      {status ? "Copied to clipboard" : "Copy to clipboard"}

                      {!status && (
                        <i
                          className={
                            !status
                              ? "fa-solid fa-clipboard px-2 text-white"
                              : "fa-solid fa-clipboard px-2"
                          }
                          // style={{ color: "#ffffff" }}
                        ></i>
                      )}
                    </button>
                  </div>
                </div>
                <div className="w-full py-8 flex justify-center">
                  <div className="w-10/12">
                    <hr />
                  </div>
                </div>

                <div className="w-full  flex justify-center pb-5">
                  <div className="w-10/12">
                    <input
                      type="email"
                      className={
                        !status
                          ? "bg-white border-2 w-full px-3 placeholder:italic py-1"
                          : "bg-white border-2 w-full px-3 placeholder:italic py-1 disabled:"
                      }
                      placeholder="Enter your email"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                    />
                    <button
                      className={
                        !status
                          ? "bg-[#544D93] text-white font-semibold rounded-sm text-lg px-4 w-full py-1 mt-2"
                          : "bg-[#544D93] text-[#ffffff6e] font-semibold rounded-sm text-lg px-4 w-full py-1 mt-2 cursor-not-allowed"
                      }
                      onClick={sendMail}
                    >
                      Send to mail
                    </button>
                    {/* <p className="">Press ESC key or click outside to close</p> */}
                  </div>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;

// yellow type #FFB933
// yellow type #544D93
