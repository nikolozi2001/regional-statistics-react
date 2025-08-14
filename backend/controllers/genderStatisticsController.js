const logger = require("../logger");

const getGenderStatistics = async (req, res) => {
  try {
    const language = req.query.language || 'ge';
    const regionId = req.query.regionId || null;
    
    logger.info(`Fetching gender statistics for language: ${language}, regionId: ${regionId}`);

    // Mock data for now - in a real implementation, this would fetch from database
    // Based on the PHP structure provided
    const genderStatistics = {
      regionId: regionId,
      genderTitleName: language === 'en' ? 'Gender Statistics' : 'გენდერული სტატისტიკა',
      demograph: language === 'en' ? 'Demographics' : 'დემოგრაფია',
      birth: {
        1: language === 'en' ? 'Birth Statistics' : 'დაბადების სტატისტიკა',
        4: language === 'en' ? 'Number of births by age and gender' : 'დაბადების რაოდენობა ასაკისა და სქესის მიხედვით',
        5: language === 'en' ? 'Sex ratio at birth' : 'სქესთა შეფარდება დაბადებისას',
        6: language === 'en' ? 'Average age of mothers' : 'დედების საშუალო ასაკი',
        8: language === 'en' ? 'Stillbirths by gender' : 'მკვდრად დაბადებული სქესის მიხედვით'
      },
      death: {
        1: language === 'en' ? 'Death Statistics' : 'გარდაცვალების სტატისტიკა',
        4: language === 'en' ? 'Deaths by age and gender' : 'გარდაცვალება ასაკისა და სქესის მიხედვით',
        7: language === 'en' ? 'Deaths by cause and gender' : 'გარდაცვალება მიზეზისა და სქესის მიხედვით'
      },
      marriage: {
        1: language === 'en' ? 'Marriage Statistics' : 'ქორწინების სტატისტიკა',
        4: language === 'en' ? 'Marriages by age groups' : 'ქორწინება ასაკობრივი ჯგუფების მიხედვით',
        5: language === 'en' ? 'Average age at marriage' : 'ქორწინების საშუალო ასაკი'
      },
      divorce: {
        1: language === 'en' ? 'Divorce Statistics' : 'განქორწინების სტატისტიკა',
        4: language === 'en' ? 'Number of divorces by age' : 'განქორწინებათა რაოდენობა ასაკის მიხედვით'
      },
      populationDescription: {
        1: language === 'en' ? 'Population Description' : 'მოსახლეობის აღწერა',
        2: language === 'en' ? 'Population by gender and age groups' : 'მოსახლეობა სქესისა და ასაკის მიხედვით',
        3: language === 'en' ? 'Urban population by gender' : 'ქალაქის მოსახლეობა სქესის მიხედვით',
        4: language === 'en' ? 'Rural population by gender' : 'სოფლის მოსახლეობა სქესის მიხედვით',
        5: language === 'en' ? 'Migration by gender' : 'მიგრაცია სქესის მიხედვით',
        6: language === 'en' ? 'Life expectancy by gender' : 'სიცოცხლის ხანგრძლივობა სქესის მიხედვით'
      },
      hotelsAndRestaurants: {
        1: language === 'en' ? 'Hotels and Restaurants' : 'სასტუმროები და რესტორნები',
        6: language === 'en' ? 'Employment in hospitality by gender' : 'დასაქმება სასტუმრო ბიზნესში სქესის მიხედვით'
      },
      healthCareAndSocialSecurity: {
        1: language === 'en' ? 'Healthcare and Social Security' : 'ჯანდაცვა და სოციალური უზრუნველყოფა',
        2: language === 'en' ? 'Healthcare Services' : 'ჯანდაცვის სერვისები',
        4: language === 'en' ? 'Medical personnel by gender' : 'სამედიცინო პერსონალი სქესის მიხედვით',
        7: language === 'en' ? 'Hospital patients by gender' : 'საავადმყოფოს პაციენტები სქესის მიხედვით',
        8: language === 'en' ? 'Outpatient visits by gender' : 'ამბულატორიული ვიზიტები სქესის მიხედვით',
        9: language === 'en' ? 'Preventive care by gender' : 'პრევენციული მოვლა სქესის მიხედვით',
        10: language === 'en' ? 'Specialist consultations by gender' : 'სპეციალისტთა კონსულტაციები სქესის მიხედვით',
        11: language === 'en' ? 'Emergency services by gender' : 'გადაუდებელი სერვისები სქესის მიხედვით',
        12: language === 'en' ? 'Mental health services by gender' : 'ფსიქიკური ჯანმრთელობის სერვისები სქესის მიხედვით',
        14: language === 'en' ? 'Social Security' : 'სოციალური უზრუნველყოფა',
        15: language === 'en' ? 'Social benefits by gender' : 'სოციალური შეღავათები სქესის მიხედვით',
        20: language === 'en' ? 'Pension recipients by gender' : 'პენსიის მიმღებები სქესის მიხედვით'
      },
      education: {
        1: language === 'en' ? 'Education' : 'განათლება',
        3: language === 'en' ? 'Students by gender and education level' : 'სტუდენტები სქესისა და განათლების დონის მიხედვით',
        4: language === 'en' ? 'Teachers by gender' : 'მასწავლებლები სქესის მიხედვით'
      }
    };

    logger.info(`Successfully retrieved gender statistics for language: ${language}, regionId: ${regionId}`);
    
    res.status(200).json({
      success: true,
      data: genderStatistics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error("Error fetching gender statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching gender statistics",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getGenderStatistics
};
