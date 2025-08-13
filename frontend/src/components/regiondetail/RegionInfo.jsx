import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const RegionInfo = () => {
  const { isEnglish, language } = useLanguage();
  const [openSections, setOpenSections] = useState({});
  const [statisticsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics data from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const langParam = isEnglish ? "en" : "ge";
        console.log('Fetching statistics with language:', langParam); // Debug log
        const response = await fetch(`http://192.168.1.27:8080/api/regionStatistics?lang=${langParam}`);
        const data = await response.json();
        
        console.log('API response:', data); // Debug log
        
        if (data.success) {
          setStatisticsData(data.data);
        } else {
          setError('Failed to load statistics data');
        }
      } catch (err) {
        console.error('Error fetching statistics:', err); // Debug log
        setError('Error fetching statistics data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [isEnglish, language]); // Added language as dependency for extra safety

  // Define demographic categories that should be grouped under "დემოგრაფია"
  const demographicCategoryKeys = ['birth', 'death', 'naturalIncrease', 'marriage', 'divorce', 'populationDescription'];

  // Helper function to get parent categories (from first row) excluding demographic ones
  const getParentCategories = () => {
    if (statisticsData.length === 0) return [];
    const firstRow = statisticsData[0];
    return Object.entries(firstRow)
      .filter(([key, value]) => 
        key !== 'ID' && 
        value && 
        value.trim() !== '' && 
        !demographicCategoryKeys.includes(key)
      )
      .map(([key, value]) => ({ key, value }));
  };

  // Helper function to get demographic categories
  const getDemographicCategories = () => {
    if (statisticsData.length === 0) return [];
    const firstRow = statisticsData[0];
    return demographicCategoryKeys
      .filter(key => firstRow[key] && firstRow[key].trim() !== '')
      .map(key => ({ key, value: firstRow[key] }));
  };

  // Helper function to get children for a specific category
  const getChildrenForCategory = (categoryKey) => {
    return statisticsData
      .slice(1) // Skip first row (parent categories)
      .map((row, index) => ({
        id: row.ID,
        value: row[categoryKey],
        rowIndex: index + 1
      }))
      .filter(item => item.value && item.value.trim() !== '');
  };

  if (loading) {
    return (
      <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
        </h2>
        <div className="text-sm text-gray-600">
          {isEnglish ? "Loading..." : "იტვირთება..."}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Language: {language} ({isEnglish ? "EN" : "GE"})
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
        </h2>
        <div className="text-sm text-red-600">{error}</div>
        <div className="text-xs text-gray-400 mt-2">
          Language: {language} ({isEnglish ? "EN" : "GE"})
        </div>
      </div>
    );
  }

  const parentCategories = getParentCategories();
  const demographicCategoriesData = getDemographicCategories();

  return (
    <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
      </h2>

      <div className="space-y-3">
        {/* Render categories in specific order */}
        {parentCategories.map(({ key, value }) => {
          const children = getChildrenForCategory(key);
          const isOpen = openSections[key] || false;

          return (
            <div key={key}>
              <Collapsible.Root 
                open={isOpen} 
                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [key]: open }))}
              >
                <div className="border-b pb-2">
                  <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
                    <span className="truncate pr-2">{value}</span>
                    <ChevronDownIcon 
                      className={`w-4 h-4 transform transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </Collapsible.Trigger>
                </div>

                {children.length > 0 && (
                  <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                    <div className="space-y-2 mt-2 mb-4">
                      {children.map((child, index) => (
                        <button 
                          key={`${child.id}-${index}`}
                          className="w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                          title={child.value}
                        >
                          <span className="block truncate">{child.value}</span>
                        </button>
                      ))}
                    </div>
                  </Collapsible.Content>
                )}
              </Collapsible.Root>

              {/* Insert Demographic Section after Population */}
              {key === 'population' && demographicCategoriesData.length > 0 && (
                <div className="mt-3">
                  <Collapsible.Root 
                    open={openSections.demography || false} 
                    onOpenChange={(open) => setOpenSections(prev => ({ ...prev, demography: open }))}
                  >
                    <div className="border-b pb-2">
                      <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
                        <span className="truncate pr-2">
                          {isEnglish ? "Demography" : "დემოგრაფია"}
                        </span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 transform transition-transform duration-200 flex-shrink-0 ${openSections.demography ? 'rotate-180' : ''}`}
                        />
                      </Collapsible.Trigger>
                    </div>

                    <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                      <div className="space-y-2 mt-2 mb-4">
                        {demographicCategoriesData.map(({ key: demKey, value: demValue }) => {
                          const children = getChildrenForCategory(demKey);
                          const isDemographicSubOpen = openSections[`demography-${demKey}`] || false;

                          return (
                            <Collapsible.Root 
                              key={`demography-${demKey}`}
                              open={isDemographicSubOpen} 
                              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [`demography-${demKey}`]: open }))}
                            >
                              <div className="border-l-2 border-blue-200 pl-3">
                                <Collapsible.Trigger className="w-full text-left text-xs font-medium text-blue-500 hover:text-blue-700 flex items-center justify-between py-1">
                                  <span className="truncate pr-2">{demValue}</span>
                                  {children.length > 0 && (
                                    <ChevronDownIcon 
                                      className={`w-3 h-3 transform transition-transform duration-200 flex-shrink-0 ${isDemographicSubOpen ? 'rotate-180' : ''}`}
                                    />
                                  )}
                                </Collapsible.Trigger>
                                
                                {children.length > 0 && (
                                  <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                                    <div className="space-y-1 mt-1 ml-4">
                                      {children.map((child, index) => (
                                        <button 
                                          key={`${child.id}-${index}`}
                                          className="w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                                          title={child.value}
                                        >
                                          <span className="block truncate">{child.value}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </Collapsible.Content>
                                )}
                              </div>
                            </Collapsible.Root>
                          );
                        })}
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionInfo;
