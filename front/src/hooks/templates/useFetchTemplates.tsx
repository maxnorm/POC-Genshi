import { useEffect, useState, useCallback } from "react";
import { Contracts } from "@/lib/enums/contracts";
import useContractEvent from "@/hooks/useContractEvent";
import { parseNFTAddressToType } from "@/lib/enums/nftType";

const templateCreatedEventABI = 'event Template_Created(uint256 indexed templateId, string templateName, address indexed nftContract)';
const templateActivatedEventABI = 'event Template_Activated(uint256 indexed templateId, string templateName, address indexed nftContract)';
const templateDeactivatedEventABI = 'event Template_Deactivated(uint256 indexed templateId, string templateName, address indexed nftContract)';

/**
 * Hook to fetch templates from the contract by listening to emitted events
 * @returns {Object} The templates and the loading state
 */
function useFetchTemplates() {
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const { events: templateCreatedEvents, refetch: refetchTemplateCreatedEvents } = useContractEvent(
    Contracts.TemplateRegistry,
    templateCreatedEventABI,
    (log: any) => ({
      templateId: log.args.templateId,
      templateName: log.args.templateName,
      nftContract: log.args.nftContract,
      blockTimestamp: log.blockTimestamp,
    })
  );

  const { events: templateActivatedEvents, refetch: refetchTemplateActivatedEvents } = useContractEvent(
    Contracts.TemplateRegistry,
    templateActivatedEventABI,
    (log: any) => ({
      templateId: log.args.templateId,
      templateName: log.args.templateName,
      nftContract: log.args.nftContract,
      blockTimestamp: log.blockTimestamp,
    })
  );

  const { events: templateDeactivatedEvents, refetch: refetchTemplateDeactivatedEvents } = useContractEvent(
    Contracts.TemplateRegistry,
    templateDeactivatedEventABI,
    (log: any) => ({
      templateId: log.args.templateId,
      templateName: log.args.templateName,
      nftContract: log.args.nftContract,
      blockTimestamp: log.blockTimestamp,
    })
  );

  useEffect(() => {
    const processTemplateEvents = () => {
      const templateMap = new Map();

      templateCreatedEvents.forEach((event: any) => {
        templateMap.set(event.templateId, {
          id: event.templateId,
          name: event.templateName,
          type: parseNFTAddressToType(event.nftContract),
          nftContract: event.nftContract,
          status: 0, // DRAFT
          createdAt: event.blockTimestamp,
        });
      });

      templateActivatedEvents.forEach((event: any) => {
        if (templateMap.has(event.templateId)) {
          templateMap.get(event.templateId).status = 1; // ACTIVE
        }
      });

      templateDeactivatedEvents.forEach((event: any) => {
        if (templateMap.has(event.templateId)) {
          templateMap.get(event.templateId).status = 2; // INACTIVE
        }
      });

      setTemplates(Array.from(templateMap.values()));
      setIsLoadingTemplates(false);
    };

    processTemplateEvents();
  }, [templateCreatedEvents, templateActivatedEvents, templateDeactivatedEvents]);

  const refetchAll = useCallback(() => {
    refetchTemplateCreatedEvents();
    refetchTemplateActivatedEvents();
    refetchTemplateDeactivatedEvents();
  }, [refetchTemplateCreatedEvents, refetchTemplateActivatedEvents, refetchTemplateDeactivatedEvents]);

  return {
    templates,
    isLoadingTemplates,
    refetchAll
  };
}

export default useFetchTemplates;