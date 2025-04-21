import { Link } from 'react-router-dom';
import { FaClipboardList} from 'react-icons/fa';


export default function Navbar() {
  return (

    <div className="col w-100 position-fixed bottom-0 end-0" style={{backgroundColor: "#1b1b1b", zIndex: "997"}}>
        <div className="" style={{ paddingLeft: "5.8rem",}}>
            <div className="row">

                <div className="w-15 my-2 border-end border-1 ">
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "-2px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color="white" className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white"> Sebastian #200202</span>
                    </div>
                </div>
                <div className="w-15 my-2 border-end border-1 ">
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "-2px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color="white" className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white"> Angel #200203</span>
                    </div>
                </div>

                {/* ... */}
                <div className="col-auto text-center p-1">
                    <div className=" p-2 px-3 cursor-pointer">
                        <span className="text-white text-bold" style={{fontSize: "16px"}}>+</span>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

  );
}
