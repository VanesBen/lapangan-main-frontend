export default function Button({title, onClick}) {
    return (
        <button onClick={onClick} className="btn px-10 py-5 bg-[#CCFF00] text-[#004D1F] border-none text-xl font-bold ">{title}</button>
    )
} 