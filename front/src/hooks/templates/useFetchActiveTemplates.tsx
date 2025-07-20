import useFetchTemplates from "./useFetchTemplates";

function useFetchActiveTemplates() { 
  const { templates, isLoadingTemplates, refetchAll } = useFetchTemplates();

  const activeTemplates = templates.filter((template) => template.status === 1);

  const refetchActiveTemplate = () => {
    refetchAll();
  };

  return {
    activeTemplates,
    isLoadingTemplates,
    refetchActiveTemplate
  };
}

export default useFetchActiveTemplates;