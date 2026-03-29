import CreateOrgModal from "./CreateOrgModal";
import UpdateOrgModal from "./UpdateOrgModal";

export const OrgsModalKeys = {
  CreateOrgModal: "CreateOrgModal",
  UpdateOrgModal: "UpdateOrgModal",
} as const;

const orgsModalRegistry = {
  [OrgsModalKeys.CreateOrgModal]: CreateOrgModal,
  [OrgsModalKeys.UpdateOrgModal]: UpdateOrgModal,
};

export default orgsModalRegistry;
