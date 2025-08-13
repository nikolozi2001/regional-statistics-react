import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { apiService } from "../../services/api";
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const RegionInfo = () => {
  const { isEnglish, language } = useLanguage();
  const [openSections, setOpenSections] = useState({});
  const [statisticsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const langParam = isEnglish ? "en" : "ge";
        const result = await apiService.getRegionStatisticsData(langParam);
        setStatisticsData(result.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [isEnglish, language]);

  const demographicCategoryKeys = ['birth', 'death', 'naturalIncrease', 'marriage', 'divorce', 'populationDescription'];

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

  const getDemographicCategories = () => {
    if (statisticsData.length === 0) return [];
    const firstRow = statisticsData[0];
    return demographicCategoryKeys
      .filter(key => firstRow[key] && firstRow[key].trim() !== '')
      .map(key => ({ key, value: firstRow[key] }));
  };

  const getChildrenForCategory = (categoryKey) => {
    return statisticsData
      .slice(1)
      .map((row, index) => ({
        id: row.ID,
        value: row[categoryKey],
        rowIndex: index + 1
      }))
      .filter(item => item.value && item.value.trim() !== '');
  };

  // Category icons and colors
  const categoryConfig = {
    population: { icon: "👥", color: "blue" },
    employment: { icon: "💼", color: "green" },
    business: { icon: "🏢", color: "purple" },
    agriculture: { icon: "🌾", color: "amber" },
    demography: { icon: "📊", color: "rose" }
  };

  if (loading) {
    return (
      <div className="w-80 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-gradient-to-br from-red-50 to-white rounded-3xl shadow-xl border border-red-100 p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
        </h2>
        <div className="bg-red-100 rounded-xl p-4 text-red-700">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const parentCategories = getParentCategories();
  const demographicCategoriesData = getDemographicCategories();

  return (
    <div className="w-80 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 backdrop-blur-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
          {isEnglish ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      <div className="space-y-3">
        {parentCategories.map(({ key, value }) => {
          const children = getChildrenForCategory(key);
          const isOpen = openSections[key] || false;
          const config = categoryConfig[key] || { icon: "📁", color: "gray" };

          return (
            <div key={key}>
              <Collapsible.Root 
                open={isOpen} 
                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [key]: open }))}
              >
                <Collapsible.Trigger 
                  className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    isOpen ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-${config.color}-50 to-${config.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <span className={`font-semibold text-gray-800 group-hover:text-${config.color}-700 transition-colors duration-200`}>
                        {value}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${children.length > 0 ? '' : 'opacity-0'}`}>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${config.color}-100 text-${config.color}-700`}>
                        {children.length}
                      </span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-${config.color}-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </Collapsible.Trigger>

                {children.length > 0 && (
                  <Collapsible.Content className="overflow-hidden transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
                    <div className="mt-2 ml-4 space-y-1 pb-2">
                      {children.map((child, index) => (
                        <button 
                          key={`${child.id}-${index}`}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 bg-white/50 hover:bg-${config.color}-50 border border-transparent hover:border-${config.color}-200 group`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-${config.color}-400 group-hover:scale-125 transition-transform duration-200`}></div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                              {child.value}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Collapsible.Content>
                )}
              </Collapsible.Root>

              {/* Demographic Section */}
              {key === 'population' && demographicCategoriesData.length > 0 && (
                <div className="mt-3">
                  <Collapsible.Root 
                    open={openSections.demography || false} 
                    onOpenChange={(open) => setOpenSections(prev => ({ ...prev, demography: open }))}
                  >
                    <Collapsible.Trigger 
                      className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        openSections.demography ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📊</span>
                          <span className="font-semibold text-rose-800 group-hover:text-rose-900 transition-colors duration-200">
                            {isEnglish ? "Demography" : "დემოგრაფია"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-200 text-rose-700">
                            {demographicCategoriesData.length}
                          </span>
                          <ChevronDownIcon 
                            className={`w-5 h-5 text-rose-600 transform transition-transform duration-300 ${openSections.demography ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>
                    </Collapsible.Trigger>

                    <Collapsible.Content className="overflow-hidden transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
                      <div className="mt-2 ml-4 space-y-2 pb-2">
                        {demographicCategoriesData.map(({ key: demKey, value: demValue }) => {
                          const subChildren = getChildrenForCategory(demKey);
                          const isSubOpen = openSections[`demography-${demKey}`] || false;

                          return (
                            <Collapsible.Root 
                              key={`demography-${demKey}`}
                              open={isSubOpen} 
                              onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [`demography-${demKey}`]: open }))}
                            >
                              <Collapsible.Trigger className="w-full text-left p-3 rounded-xl bg-rose-50/50 hover:bg-rose-100/50 transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                    <span className="text-sm font-medium text-rose-700 group-hover:text-rose-800">
                                      {demValue}
                                    </span>
                                  </div>
                                  {subChildren.length > 0 && (
                                    <ChevronDownIcon 
                                      className={`w-4 h-4 text-rose-500 transform transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`}
                                    />
                                  )}
                                </div>
                              </Collapsible.Trigger>
                              
                              {subChildren.length > 0 && (
                                <Collapsible.Content className="overflow-hidden transition-all duration-200">
                                  <div className="ml-6 mt-1 space-y-1">
                                    {subChildren.map((child, index) => (
                                      <button 
                                        key={`${child.id}-${index}`}
                                        className="w-full text-left p-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 flex items-center gap-2"
                                      >
                                        <div className="w-1 h-1 rounded-full bg-rose-300"></div>
                                        <span className="truncate">{child.value}</span>
                                      </button>
                                    ))}
                                  </div>
                                </Collapsible.Content>
                              )}
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
