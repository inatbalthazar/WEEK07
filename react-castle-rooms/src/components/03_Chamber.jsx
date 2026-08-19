import Room from "./04_Room.jsx";

export default function Chamber() {
    return (
        <div className="rounded-[50px] flex flex-col justify-center items-center p-5 bg-[#2E1A47] w-[95%] my-1">
            <h1 className="text-red-800 font-bold text-1xl tracking-wide mb-2">Wormhole</h1>

            <Room 
            />
        </div>
    );
}