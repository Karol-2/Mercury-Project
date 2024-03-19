import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import peer from "../peer/peer";

function RoomCallPage() {
    peer.on("call", (call) => {
        console.log(call);
    })
    return (
        <>
            <Navbar />
            <div>Room call page</div>
            <Footer />
        </>
    )
}

export default RoomCallPage;