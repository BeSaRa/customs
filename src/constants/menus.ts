import { MenuItemContract } from '@contracts/menu-item-contract';
import { AppIcons } from '@constants/app-icons';
import { AppFullRoutes } from '@constants/app-full-routes';
import { MenuIdes } from '@constants/menu-ides';
import { TeamNames } from '@enums/team-names';

export const Menus: MenuItemContract[] = [
  {
    id: MenuIdes.ADMINISTRATION,
    langKey: 'menu_administration',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.ADMINISTRATION,
    permissionGroup: 'ADMINISTRATION',
  },
  {
    id: MenuIdes.LOCALIZATION,
    langKey: 'menu_localization',
    icon: AppIcons.TRANSLATE,
    path: AppFullRoutes.LOCALIZATION,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_LOCALIZATION',
  },
  {
    id: MenuIdes.INTERNAL_USER,
    langKey: 'menu_internal_user',
    icon: AppIcons.INTERNAL_USER,
    path: AppFullRoutes.INTERNAL_USER,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_INTERNAL_USERS',
  },
  {
    id: MenuIdes.TEAM,
    langKey: 'menu_team',
    icon: AppIcons.TEAM,
    path: AppFullRoutes.TEAM,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_TEAMS',
  },
  {
    id: MenuIdes.PENALTY,
    langKey: 'menu_penalty',
    icon: AppIcons.PENALTY,
    path: AppFullRoutes.PENALTY,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_PENALTY',
  },
  {
    id: MenuIdes.JOB_TITLE,
    langKey: 'menu_job_title',
    icon: AppIcons.JOB_TITLE,
    path: AppFullRoutes.JOB_TITLE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_JOB_TITLES',
  },
  {
    id: MenuIdes.VIOLATION_CLASSIFICATION,
    langKey: 'menu_violation_classification',
    icon: AppIcons.BOOK_CANCEL,
    path: AppFullRoutes.VIOLATION_CLASSIFICATION,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_VIOLATION_CLASSIFICATION',
  },
  {
    id: MenuIdes.VIOLATION_TYPE,
    langKey: 'menu_violation_type',
    icon: AppIcons.BOOK_CANCEL_OUTLINE,
    path: AppFullRoutes.VIOLATION_TYPE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_VIOLATION_TYPE',
  },
  {
    id: MenuIdes.PERMISSION_ROLE,
    langKey: 'menu_permission_role',
    icon: AppIcons.PERMISSIONS_LIST,
    path: AppFullRoutes.PERMISSION_ROLE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_PERMISSION_ROLE',
  },
  {
    id: MenuIdes.MAWARED_EMPLOYEE,
    langKey: 'menu_mawared_employee',
    icon: AppIcons.RESOURCES_CASE,
    path: AppFullRoutes.MAWARED_EMPLOYEE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_MAWARED_EMPLOYEE',
  },
  {
    id: MenuIdes.ORGANIZATION_UNIT,
    langKey: 'menu_organization_unit',
    icon: AppIcons.SITE_MAP_OUTLINE,
    path: AppFullRoutes.ORGANIZATION_UNIT,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_ORGANIZATION_UNIT',
  },
  {
    id: MenuIdes.MAWARED_DEPARTMENT,
    langKey: 'menu_mawared_department',
    icon: AppIcons.MAWARED_DEPARTMENT,
    path: AppFullRoutes.MAWARED_DEPARTMENT,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_MAWARED_DEPARTMENT',
  },
  {
    id: MenuIdes.SERVICES,
    langKey: 'menu_services',
    icon: AppIcons.SERVICES,
    parent: MenuIdes.ADMINISTRATION,
    path: AppFullRoutes.SERVICES,
    permission: 'MANAGE_SERVICES_DATA',
  },
  {
    id: MenuIdes.EMAIL_TEMPLATE,
    langKey: 'menu_email_template',
    icon: AppIcons.EMAIL_TEMPLATE,
    parent: MenuIdes.ADMINISTRATION,
    path: AppFullRoutes.EMAIL_TEMPLATE,
    permission: 'MANAGE_EMAIL_TEMPLATE',
  },
  {
    id: MenuIdes.GLOBAL_SETTING,
    langKey: 'menu_global_setting',
    icon: AppIcons.GLOBAL_SETTING,
    path: AppFullRoutes.GLOBAL_SETTING,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGEMNT_SYSTEM_PREFRENCES',
  },
  {
    id: MenuIdes.ELECTRONIC_SERVICES,
    langKey: 'menu_electronic_services',
    icon: AppIcons.ELECTRONIC_SERVICES,
    path: AppFullRoutes.ELECTRONIC_SERVICES,
  },
  {
    id: MenuIdes.TEAM_INBOX,
    langKey: 'menu_team_inbox',
    icon: AppIcons.TEAM_INBOX,
    path: AppFullRoutes.TEAM_INBOX,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    counter: 'teamInbox',
  },
  {
    id: MenuIdes.USER_INBOX,
    langKey: 'menu_user_inbox',
    icon: AppIcons.USER_INBOX,
    path: AppFullRoutes.USER_INBOX,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    counter: 'personalInbox',
  },
  {
    id: MenuIdes.INVESTIGATION,
    langKey: 'menu_investigation',
    icon: AppIcons.INVESTIGATION,
    path: AppFullRoutes.INVESTIGATION,
    parent: MenuIdes.ELECTRONIC_SERVICES,
  },
  {
    id: MenuIdes.INVESTIGATION_SEARCH,
    langKey: 'menu_investigation_search',
    icon: AppIcons.SEARCH,
    path: AppFullRoutes.INVESTIGATION_SEARCH,
    parent: MenuIdes.ELECTRONIC_SERVICES,
  },
  {
    id: MenuIdes.LEGAL_RULE,
    langKey: 'menu_legal_rule',
    icon: AppIcons.LEGAL_RULE,
    path: AppFullRoutes.LEGAL_RULE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_LEGAL_RULE',
  },
  {
    id: MenuIdes.ATTACHMENT_TYPE,
    langKey: 'menu_attachment_type',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.ATTACHMENT_TYPE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_ATTACHMENT_TYPE',
  },
  {
    id: MenuIdes.GUIDE_PANEL,
    langKey: 'menu_guide_panel',
    icon: AppIcons.GUIDE_PANEL,
    path: AppFullRoutes.GUIDE_PANEL,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    permission: 'GUIDE_PANEL',
  },
  {
    id: MenuIdes.INVESTIGATION_DRAFTS,
    langKey: 'menu_investigation_drafts',
    icon: AppIcons.INVESTIGATION_DRAFTS,
    path: AppFullRoutes.INVESTIGATION_DRAFTS,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    permission: 'SEARCH_FOR_DRAFTS',
  },
  {
    id: MenuIdes.CLEARING_AGENT,
    langKey: 'menu_clearing_agent',
    icon: AppIcons.CLEARING_AGENT,
    path: AppFullRoutes.CLEARING_AGENT,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_CLEARING_AGENT',
  },
  {
    id: MenuIdes.CLEARING_AGENCY,
    langKey: 'menu_clearing_agency',
    icon: AppIcons.CLEARING_AGENCY,
    path: AppFullRoutes.CLEARING_AGENCY,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_CLEARING_AGENCY',
  },
  {
    id: MenuIdes.SUSPENDED_EMPLOYEE,
    langKey: 'menu_suspended_employee',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.SUSPENDED_EMPLOYEE,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_SUSPENDED_EMPLOYEE',
  },
  {
    id: MenuIdes.CALENDAR,
    langKey: 'menu_calendar',
    icon: AppIcons.CALENDAR,
    path: AppFullRoutes.CALENDAR,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    permissionFromTeam: TeamNames.Disciplinary_Committee,
  },
  {
    id: MenuIdes.MANAGER_DELEGATION,
    langKey: 'menu_manager_delegation',
    icon: AppIcons.SETTINGS,
    path: AppFullRoutes.MANAGER_DELEGATION,
    parent: MenuIdes.ADMINISTRATION,
    permission: 'MANAGE_MANAGER_DELEGATION',
  },
  {
    id: MenuIdes.GRIEVANCE,
    langKey: 'menu_grievances',
    icon: AppIcons.HAND_BACK_RIGHT,
    path: AppFullRoutes.GRIEVANCE_ARCHIVE,
    parent: MenuIdes.ELECTRONIC_SERVICES,
    permission: 'GRIEVANCE_ARCHIVE',
  },
];
