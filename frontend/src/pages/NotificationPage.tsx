import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserContext";
function NotificationPage() {
    const {notifications} = useUser();
    return (
        <>
            <Navbar />
            <div>
                {notifications.map((n,i) => <div key={i}>
                    <span>type: {n.type} </span>
                    <span>from: {n.senderId}</span>
                </div>)}
            </div>
            <Footer />
        </>
    )
}
export default NotificationPage;