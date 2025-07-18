import { useEffect, useState, useCallback } from "react";
import {User} from "@/lib/types/User";
import { Contracts } from "@/lib/enums/contracts";
import useContractEvent from "./useContractEvent";
import { ROLES } from "@/lib/constants/roles";

const roleGrantedEventABI = 'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)';
const roleRevokedEventABI = 'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)';


function useUsersFetch() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [roleGrantedCount, setRoleGrantedCount] = useState(0);
  const [roleRevokedCount, setRoleRevokedCount] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const { events: roleGrantedEvents, refetch: refetchRoleGrantedEvents } = useContractEvent(
    Contracts.AccessManager,
    roleGrantedEventABI,
    (log: any) => ({
      role: log.args.role,
      account: log.args.account,
      sender: log.args.sender,
      blockTimestamp: log.blockTimestamp,
    })
  );

  const { events: roleRevokedEvents, refetch: refetchRoleRevokedEvents } = useContractEvent(
    Contracts.AccessManager,
    roleRevokedEventABI,
    (log: any) => ({
      role: log.args.role,
      account: log.args.account,
      sender: log.args.sender,
      blockTimestamp: log.blockTimestamp,
    })
  );

  const processRoleEvents = useCallback(async () => {
    setIsLoadingUser(true);

    try {
      setRoleGrantedCount(roleGrantedEvents.length);
      setRoleRevokedCount(roleRevokedEvents.length);

      const userRolesMap = new Map<string, User>();

      const getRoleName = (roleHash: string): string => {
        const roleEntry = Object.entries(ROLES).find(([_, hash]) => hash === roleHash);
        return roleEntry ? roleEntry[0] : roleHash;
      };

      roleGrantedEvents.forEach((event) => {
        const userAddress = event.account.toLowerCase();
        const roleName = getRoleName(event.role);
        
        if (!userRolesMap.has(userAddress)) {
          userRolesMap.set(userAddress, {
            address: userAddress,
            roles: {},
            lastUpdated: event.blockTimestamp
          });
        }

        const user = userRolesMap.get(userAddress)!;
        user.roles[roleName] = true;
        user.lastUpdated = Math.max(user.lastUpdated, event.blockTimestamp);
      });

      roleRevokedEvents.forEach((event) => {
        const userAddress = event.account.toLowerCase();
        const roleName = getRoleName(event.role);
        
        if (userRolesMap.has(userAddress)) {
          const user = userRolesMap.get(userAddress)!;
          user.roles[roleName] = false;
          user.lastUpdated = Math.max(user.lastUpdated, event.blockTimestamp);
        }
      });

      const usersArray = Array.from(userRolesMap.values())
        .sort((a, b) => b.lastUpdated - a.lastUpdated);
        
      setAllUsers(usersArray);
    } catch (error) {
      console.error("Failed to process role events", error);
    } finally {
      setIsLoadingUser(false);
    }

  }, [roleGrantedEvents, roleRevokedEvents]);

  useEffect(() => {
    processRoleEvents();
  }, [processRoleEvents]);

  return {
    allUsers,
    isLoadingUser,
    refetchRoleGrantedEvents,
    refetchRoleRevokedEvents,
    roleGrantedCount,
    roleRevokedCount,
  };
}

export default useUsersFetch;
