import React, { memo, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";

// Import images for English
import euEnImage from "../assets/images/en/eu.png";
import denmarkEnImage from "../assets/images/en/denmark.png";
import undpEnImage from "../assets/images/en/undp.png";

// Import images for Georgian
import euKaImage from "../assets/images/ka/eu.png";
import denmarkKaImage from "../assets/images/ka/denmark.png";
import undpKaImage from "../assets/images/ka/undp.png";

// Translation keys
const translations = {
  EN: {
    COPYRIGHT1:
      "This website has been produced with the assistance of the European Union, Denmark and the United Nations Development Programme (UNDP).",
    COPYRIGHT2:
      "Its contents are the sole responsibility of the GEOSTAT and do not necessarily reflect the views of the European Union, Denmark and UNDP.",
    COPYRIGHT3: "Terms of Use",
  },
  GE: {
    COPYRIGHT1:
      "ვებგვერდი შექმნილია ევროკავშირის, დანიისა და გაეროს განვითარების პროგრამის მხარდაჭერით. მის შინაარსზე სრულად პასუხისმგებელია საქართველოს სტატისტიკის ეროვნული სამსახური.",
    COPYRIGHT2:
      "ვებგვერდის შინაარსი შესაძლოა არ გამოხატავდეს ევროკავშირის, დანიისა და გაეროს განვითარების პროგრამის შეხედულებებს.",
    COPYRIGHT3: "მონაცემთა გამოყენების პირობები",
  },
};

// Constants for styling
const FOOTER_CLASSES =
  "bg-white w-full py-3 px-4 border-t border-gray-200 flex-shrink-0";
const CONTAINER_CLASSES = "max-w-8xl mx-auto";
const IMAGES_CONTAINER_CLASSES =
  "flex items-center justify-center gap-3 md:gap-6 mb-2 flex-wrap";
const EU_IMAGE_CLASSES = "h-8 md:h-10 w-auto object-contain";
const FOOTER_IMAGE_CLASSES = "h-6 md:h-8 w-auto object-contain";
const UNDP_IMAGE_CLASSES = "h-8 md:h-10 w-auto object-contain";
const TEXT_CONTAINER_CLASSES = "text-center space-y-1";
const COPYRIGHT_TEXT_CLASSES =
  "block text-xs md:text-sm text-gray-700 leading-relaxed";
const LINK_CLASSES =
  "text-[#337ab7] hover:text-[#23527c] hover:underline transition-colors duration-200";

/**
 * Footer component with language-specific content and partner logos
 * Features: Responsive design, language-aware content, partner acknowledgments
 */
const Footer = memo(({ isVisible = true }) => {
  const { language } = useLanguage();

  // Memoized images based on language
  const footerImages = useMemo(() => {
    const isEnglish = language === "EN";
    return {
      eu: isEnglish ? euEnImage : euKaImage,
      denmark: isEnglish ? denmarkEnImage : denmarkKaImage,
      undp: isEnglish ? undpEnImage : undpKaImage,
    };
  }, [language]);

  // Memoized translations
  const t = useMemo(
    () => translations[language] || translations.EN,
    [language]
  );

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <footer className={FOOTER_CLASSES} id="footer">
      <div className={CONTAINER_CLASSES}>
        {/* Partner Logos */}
        <div className={IMAGES_CONTAINER_CLASSES}>
          <img
            src={footerImages.eu}
            alt={language === "EN" ? "European Union" : "ევროკავშირი"}
            className={EU_IMAGE_CLASSES}
            loading="lazy"
          />
          <img
            src={footerImages.denmark}
            alt={language === "EN" ? "Denmark" : "დანია"}
            className={FOOTER_IMAGE_CLASSES}
            loading="lazy"
          />
          <img
            src={footerImages.undp}
            alt={
              language === "EN"
                ? "United Nations Development Programme"
                : "გაეროს განვითარების პროგრამა"
            }
            className={UNDP_IMAGE_CLASSES}
            loading="lazy"
          />
        </div>

        {/* Copyright Text */}
        <div className={TEXT_CONTAINER_CLASSES}>
          <span className={COPYRIGHT_TEXT_CLASSES}>
            <strong>{t.COPYRIGHT1}</strong>
          </span>

          <span className={COPYRIGHT_TEXT_CLASSES}>
            <strong>{t.COPYRIGHT2}</strong>
          </span>

          <span className={COPYRIGHT_TEXT_CLASSES}>
            <a
              href="https://www.geostat.ge/ka/page/monacemta-gamoyenebis-pirobebi"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASSES}
              aria-label={t.COPYRIGHT3}
            >
              {t.COPYRIGHT3}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
