import { verify } from "jsonwebtoken";
function decode(handshakeData: string, linkSecret: string): any | null {
    try {
        const decodedData = verify(handshakeData, linkSecret);
        return decodedData;
    } catch {
        return null;
    }
}
export default decode;