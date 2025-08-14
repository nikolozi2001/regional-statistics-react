import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { apiService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import excelIcon from '../assets/excel.png';

const GenderStatistics = () => {
  const { regionId } = useParams();
  const { language } = useLanguage();
  const [genderData, setGenderData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch real data first
        try {
          const genderResponse = await apiService.getGenderStatistics(language === 'EN' ? 'en' : 'ge', regionId);
          if (genderResponse.success) {
            setGenderData(genderResponse.data);
          }
          
          // If regionId is provided, fetch region data as well
          if (regionId) {
            const regionsResponse = await apiService.getRegionsData();
            if (regionsResponse.success) {
              const region = regionsResponse.data.find(r => r.ID === regionId || r.code === regionId);
              setRegionData(region);
            }
          }
          
          if (genderResponse.success) {
            return;
          }
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
        }
        
        // Fallback to mock data structure based on the PHP code
        const mockData = {
          genderTitleName: language === 'EN' ? 'Gender Statistics' : 'გენდერული სტატისტიკა',
          demograph: language === 'EN' ? 'Demographics' : 'დემოგრაფია',
          birth: {
            1: language === 'EN' ? 'Birth Statistics' : 'დაბადების სტატისტიკა',
            4: language === 'EN' ? 'Number of births by age and gender' : 'დაბადების რაოდენობა ასაკისა და სქესის მიხედვით',
            5: language === 'EN' ? 'Sex ratio at birth' : 'სქესთა შეფარდება დაბადებისას',
            6: language === 'EN' ? 'Average age of mothers' : 'დედების საშუალო ასაკი',
            8: language === 'EN' ? 'Stillbirths by gender' : 'მკვდრად დაბადებული სქესის მიხედვით'
          },
          death: {
            1: language === 'EN' ? 'Death Statistics' : 'გარდაცვალების სტატისტიკა',
            4: language === 'EN' ? 'Deaths by age and gender' : 'გარდაცვალება ასაკისა და სქესის მიხედვით',
            7: language === 'EN' ? 'Deaths by cause and gender' : 'გარდაცვალება მიზეზისა და სქესის მიხედვით'
          },
          marriage: {
            1: language === 'EN' ? 'Marriage Statistics' : 'ქორწინების სტატისტიკა',
            4: language === 'EN' ? 'Marriages by age groups' : 'ქორწინება ასაკობრივი ჯგუფების მიხედვით',
            5: language === 'EN' ? 'Average age at marriage' : 'ქორწინების საშუალო ასაკი'
          },
          divorce: {
            1: language === 'EN' ? 'Divorce Statistics' : 'განქორწინების სტატისტიკა',
            4: language === 'EN' ? 'Number of divorces by age' : 'განქორწინებათა რაოდენობა ასაკის მიხედვით'
          },
          populationDescription: {
            1: language === 'EN' ? 'Population Description' : 'მოსახლეობის აღწერა',
            2: language === 'EN' ? 'Population by gender and age groups' : 'მოსახლეობა სქესისა და ასაკის მიხედვით',
            3: language === 'EN' ? 'Urban population by gender' : 'ქალაქის მოსახლეობა სქესის მიხედვით',
            4: language === 'EN' ? 'Rural population by gender' : 'სოფლის მოსახლეობა სქესის მიხედვით',
            5: language === 'EN' ? 'Migration by gender' : 'მიგრაცია სქესის მიხედვით',
            6: language === 'EN' ? 'Life expectancy by gender' : 'სიცოცხლის ხანგრძლივობა სქესის მიხედვით'
          },
          hotelsAndRestaurants: {
            1: language === 'EN' ? 'Hotels and Restaurants' : 'სასტუმროები და რესტორნები',
            6: language === 'EN' ? 'Employment in hospitality by gender' : 'დასაქმება სასტუმრო ბიზნესში სქესის მიხედვით'
          },
          healthCareAndSocialSecurity: {
            1: language === 'EN' ? 'Healthcare and Social Security' : 'ჯანდაცვა და სოციალური უზრუნველყოფა',
            2: language === 'EN' ? 'Healthcare Services' : 'ჯანდაცვის სერვისები',
            4: language === 'EN' ? 'Medical personnel by gender' : 'სამედიცინო პერსონალი სქესის მიხედვით',
            7: language === 'EN' ? 'Hospital patients by gender' : 'საავადმყოფოს პაციენტები სქესის მიხედვით',
            8: language === 'EN' ? 'Outpatient visits by gender' : 'ამბულატორიული ვიზიტები სქესის მიხედვით',
            9: language === 'EN' ? 'Preventive care by gender' : 'პრევენციული მოვლა სქესის მიხედვით',
            10: language === 'EN' ? 'Specialist consultations by gender' : 'სპეციალისტთა კონსულტაციები სქესის მიხედვით',
            11: language === 'EN' ? 'Emergency services by gender' : 'გადაუდებელი სერვისები სქესის მიხედვით',
            12: language === 'EN' ? 'Mental health services by gender' : 'ფსიქიკური ჯანმრთელობის სერვისები სქესის მიხედვით',
            14: language === 'EN' ? 'Social Security' : 'სოციალური უზრუნველყოფა',
            15: language === 'EN' ? 'Social benefits by gender' : 'სოციალური შეღავათები სქესის მიხედვით',
            20: language === 'EN' ? 'Pension recipients by gender' : 'პენსიის მიმღებები სქესის მიხედვით'
          },
          education: {
            1: language === 'EN' ? 'Education' : 'განათლება',
            3: language === 'EN' ? 'Students by gender and education level' : 'სტუდენტები სქესისა და განათლების დონის მიხედვით',
            4: language === 'EN' ? 'Teachers by gender' : 'მასწავლებლები სქესის მიხედვით'
          }
        };
        
        setGenderData(mockData);
      } catch (err) {
        console.error('Error fetching gender statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [language, regionId]);

  const handleExcelDownload = (linkId) => {
    // TODO: Implement Excel download functionality
    const params = regionId ? `?regionId=${regionId}` : '';
    console.log(`Download Excel for: ${linkId}${params}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'EN' ? 'Error Loading Data' : 'მონაცემების ჩატვირთვის შეცდომა'}
            </h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Region breadcrumb or title */}
        {regionData && (
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="/" className="text-blue-600 hover:text-blue-800">
                    {language === 'EN' ? 'Home' : 'მთავარი'}
                  </a>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">
                    {regionData.NameEN && language === 'EN' ? regionData.NameEN : regionData.Name}
                  </span>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <span className="text-gray-500">
                    {language === 'EN' ? 'Gender Statistics' : 'გენდერული სტატისტიკა'}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        )}
        
        <div className="center">
          <div className="max-w-4xl mx-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden gender_table">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    {genderData?.genderTitleName}
                    {regionData && (
                      <div className="text-sm font-normal mt-1 opacity-90">
                        {regionData.NameEN && language === 'EN' ? regionData.NameEN : regionData.Name}
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Demographics Section */}
                <tr>
                  <td className="px-6 py-3 bg-gray-100 font-semibold text-gray-800" id="genderListTitle">
                    {genderData?.demograph}
                  </td>
                </tr>
                
                {/* Birth Statistics */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.birth[1]}
                  </td>
                </tr>
                
                {[4, 5, 6, 8].map((id) => (
                  <tr key={`birth-${id}`} className="informacia3 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.birth[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkBirths${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Death Statistics */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.death[1]}
                  </td>
                </tr>
                
                {[4, 7].map((id) => (
                  <tr key={`death-${id}`} className="informacia4 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.death[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkdeath${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Marriage Statistics */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.marriage[1]}
                  </td>
                </tr>
                
                {[4, 5].map((id) => (
                  <tr key={`marriage-${id}`} className="informacia6 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.marriage[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkmarriage${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Divorce Statistics */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.divorce[1]}
                  </td>
                </tr>
                
                <tr className="informacia7 border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{genderData?.divorce[4]}</span>
                      <button
                        onClick={() => handleExcelDownload('linknumberdivorce')}
                        className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Download Excel"
                      >
                        <img src={excelIcon} alt="excel" width="25" height="25" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Population Description */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.populationDescription[1]}
                  </td>
                </tr>
                
                {[2, 3, 4, 5, 6].map((id) => (
                  <tr key={`population-${id}`} className="informacia8 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.populationDescription[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkpopulationDescription${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Hotels and Restaurants */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.hotelsAndRestaurants[1]}
                  </td>
                </tr>
                
                <tr className="informacia18 border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{genderData?.hotelsAndRestaurants[6]}</span>
                      <button
                        onClick={() => handleExcelDownload('linkhotels5')}
                        className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Download Excel"
                      >
                        <img src={excelIcon} alt="excel" width="25" height="25" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Healthcare and Social Security */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.healthCareAndSocialSecurity[1]}
                  </td>
                </tr>
                
                <tr>
                  <td className="px-6 py-3 bg-gray-100 font-medium text-gray-600" id="genderListTitle">
                    {genderData?.healthCareAndSocialSecurity[2]}
                  </td>
                </tr>
                
                {[4, 7, 8, 9, 10, 11, 12].map((id) => (
                  <tr key={`healthcare-${id}`} className="informacia9 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.healthCareAndSocialSecurity[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkhealthCareAndSocialSecurity${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                <tr>
                  <td className="px-6 py-3 bg-gray-100 font-medium text-gray-600" id="genderListTitle">
                    {genderData?.healthCareAndSocialSecurity[14]}
                  </td>
                </tr>
                
                {[15, 20].map((id) => (
                  <tr key={`social-${id}`} className="informacia10 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.healthCareAndSocialSecurity[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkhealthCareAndSocialSecurity${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Education */}
                <tr>
                  <td className="px-6 py-3 bg-gray-50 font-medium text-gray-700" id="genderListTitle">
                    {genderData?.education[1]}
                  </td>
                </tr>
                
                {[3, 4].map((id) => (
                  <tr key={`education-${id}`} className="informacia11 border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{genderData?.education[id]}</span>
                        <button
                          onClick={() => handleExcelDownload(`linkeducation${id}`)}
                          className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Download Excel"
                        >
                          <img src={excelIcon} alt="excel" width="25" height="25" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GenderStatistics;
