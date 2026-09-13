import "./styles/SocialLinks.css";
import { discordAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";

const SOCIAL_LINKS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "/linkedin.svg",
    url: "https://www.linkedin.com/company/aws-cloud-clubs-addis-ababa-university/",
  },
  {
    key: "meetup",
    label: "Meetup",
    icon: "/meetup4.png",
    url: "https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/",
  },
  {
    key: "telegram",
    label: "Join Telegram",
    icon: "/Telegram_logo.svg.webp",
    url: "https://t.me/aws_cloud_club",
  },
];

const SocialSection = () => {
  const { showToast } = useToast();

  const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDiscordClick = async () => {
    try {
      const data = await discordAPI.getInvite();
      if (data?.inviteUrl) {
        window.open(data.inviteUrl, "_blank", "noopener,noreferrer");
      } else {
        showToast("Discord invite is unavailable right now. Please try again later.", "error");
      }
    } catch (err) {
      console.error("Failed to fetch Discord invite:", err);
      showToast("Couldn't reach Discord right now. Please try again later.", "error");
    }
  };

  return (
    <section className="social-section">
      <h2>Follow Us</h2>
      <p>Stay connected with the AWS Student Builder Group at Addis Ababa University</p>
      <div className="social-icons">
        {SOCIAL_LINKS.map((link) => (
          <button
            key={link.key}
            type="button"
            className="social-icon-button"
            aria-label={link.label}
            onClick={() => handleSocialClick(link.url)}
          >
            <img src={link.icon} alt="" />
          </button>
        ))}
        <button
          type="button"
          className="social-icon-button"
          aria-label="Join our Discord"
          onClick={handleDiscordClick}
        >
          <img src="/discord.svg" alt="" />
        </button>
      </div>
    </section>
  );
};

export default SocialSection;
