class MeetingService {
    
    private url: string = "http://localhost:5000";

    async createMeetingWithToken(ownerId: string, guestId: string) {
        const endpoint = this.url + "/meeting"
        try {
            const response = await fetch(endpoint, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ownerId, guestId }), 
            });
            const data = await response.json();
            const {token} = data;
            return token;
        } catch (error) {
            console.error("Error ocurred during fetch data:", error);
            throw error;
        }
    }

}

export default new MeetingService();