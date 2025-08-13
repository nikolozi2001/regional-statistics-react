import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { apiService } from "../../services/api";
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { FaFileExcel } from 'react-icons/fa';

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
        const result = await apiService.getRegionStatisticsData(langParam);
        setStatisticsData(result.data);
      } catch (err) {
        console.error('Error fetching statistics:', err); // Debug log
        setError(err.message);
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
    <div className="w-1/5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
      <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">
        {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
      </h2>

      <div className="space-y-1">
        {/* Render categories in specific order */}
        {parentCategories.map(({ key, value }) => {
          const children = getChildrenForCategory(key);
          const isOpen = openSections[key] || false;

          return (
            <div key={key} className="group">
              <Collapsible.Root 
                open={isOpen} 
                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [key]: open }))}
              >
                <Collapsible.Trigger className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50/80 transition-all duration-300 ease-out flex items-center justify-between group-hover:shadow-sm border border-transparent hover:border-gray-100">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{value}</span>
                  {children.length > 0 ? (
                    <ChevronDownIcon 
                      className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transform transition-all duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
                    />
                  ) : (
                    <FaFileExcel 
                      className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors duration-200"
                    />
                  )}
                </Collapsible.Trigger>

                {children.length > 0 && (
                  <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                    <div className="px-4 pb-2 space-y-1">
                      {children.map((child, index) => (
                        <button 
                          key={`${child.id}-${index}`}
                          className="w-full text-left py-2 px-3 rounded-lg text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50/60 transition-all duration-200 ease-out group/item"
                          title={child.value}
                        >
                          <span className="block truncate group-hover/item:font-medium transition-all duration-200">{child.value}</span>
                        </button>
                      ))}
                    </div>
                  </Collapsible.Content>
                )}
              </Collapsible.Root>

              {/* Insert Demographic Section after Population */}
              {key === 'population' && demographicCategoriesData.length > 0 && (
                <div className="mt-2 group">
                  <Collapsible.Root 
                    open={openSections.demography || false} 
                    onOpenChange={(open) => setOpenSections(prev => ({ ...prev, demography: open }))}
                  >
                    <Collapsible.Trigger className="w-full text-left py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-purple-50/80 transition-all duration-300 ease-out flex items-center justify-between group-hover:shadow-sm border border-transparent hover:border-indigo-100">
                      <span className="text-sm font-medium text-indigo-700 group-hover:text-indigo-900 transition-colors duration-200">
                        {isEnglish ? "Demography" : "დემოგრაფია"}
                      </span>
                      {demographicCategoriesData.length > 0 ? (
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transform transition-all duration-300 ease-out ${openSections.demography ? 'rotate-180' : ''}`}
                        />
                      ) : (
                        <FaFileExcel 
                          className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors duration-200"
                        />
                      )}
                    </Collapsible.Trigger>

                    <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                      <div className="px-4 pb-2 space-y-1">
                        {demographicCategoriesData.map(({ key: demKey, value: demValue }) => {
                          const children = getChildrenForCategory(demKey);
                          const isDemographicSubOpen = openSections[`demography-${demKey}`] || false;

                          return (
                            <Collapsible.Root 
                              key={`demography-${demKey}`}
                              open={isDemographicSubOpen} 
                              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [`demography-${demKey}`]: open }))}
                            >
                              <div className="ml-2 border-l border-indigo-100 pl-4 group/sub">
                                <Collapsible.Trigger className="w-full text-left py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-all duration-200 ease-out flex items-center justify-between">
                                  <span className="text-xs font-medium text-indigo-600 group-hover/sub:text-indigo-800 transition-colors duration-200">{demValue}</span>
                                  {children.length > 0 ? (
                                    <ChevronDownIcon 
                                      className={`w-3 h-3 text-indigo-400 group-hover/sub:text-indigo-600 transform transition-all duration-200 ease-out ${isDemographicSubOpen ? 'rotate-180' : ''}`}
                                    />
                                  ) : (
                                    <FaFileExcel 
                                      className="w-3 h-3 text-green-500 group-hover:text-green-600 transition-colors duration-200"
                                    />
                                  )}
                                </Collapsible.Trigger>
                                
                                {children.length > 0 && (
                                  <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                                    <div className="pl-2 space-y-1 mt-1">
                                      {children.map((child, index) => (
                                        <button 
                                          key={`${child.id}-${index}`}
                                          className="w-full text-left py-1.5 px-2 rounded-md text-xs text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50/30 transition-all duration-200 ease-out group/leaf"
                                          title={child.value}
                                        >
                                          <span className="block truncate group-hover/leaf:font-medium transition-all duration-200">{child.value}</span>
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
