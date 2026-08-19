import Chamber from "./03_Chamber.jsx";

export default function Tower() {
    return (
        <div className="rounded-[55px] flex flex-col justify-center items-center p-5 bg-[#1F2833] w-[95%] my-1">
            <h1 className="text-red-800 font-bold text-1xl tracking-wide mb-2">NASA Facility</h1>

            <Chamber
            />
        </div>
    )
}