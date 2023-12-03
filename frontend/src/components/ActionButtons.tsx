import AudioButton from "./AudioButton/AudioButton";
import VideoButton from "./VideoButton/VideoButton";
import HangupButton from "./HangupButton";
interface ActionButtonsProps {
  smallFeedEl: any;
  largeFeedEl: any;
}
function ActionButtons({ smallFeedEl, largeFeedEl }: ActionButtonsProps) {
  return (
    <div>
      <div>
        <AudioButton smallFeedEl={smallFeedEl} />
        <VideoButton smallFeedEl={smallFeedEl} />
      </div>
      <div>
        <HangupButton smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />
      </div>
    </div>
  );
}
export default ActionButtons;
