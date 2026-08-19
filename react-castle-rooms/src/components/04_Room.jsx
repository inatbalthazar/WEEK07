import Hall from "./05_Hall.jsx";

export default function Room() {
    return (
        <div className="rounded-[45px] flex flex-col justify-center items-center p-5 bg-[#4B2E83] w-[95%] my-1">
            <h1 className="text-red-800 font-bold text-1xl tracking-wide mb-2">Miller's Planet</h1>

            <Hall 
            />
        </div>
    );
}