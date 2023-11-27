import {Cosmo_Module, Cosmo_WebStorage} from '@pixel-forge/cosmo-utils';

const storage_SelectedKey = new Cosmo_WebStorage<string>('cosmo-dev-manager__selected-key');
const storage_PanelCollapse = new Cosmo_WebStorage<boolean>('cosmo-dev-manager__panel-collapse');

class CosmoModule_DevManager_Class
	extends Cosmo_Module {

	// ################## Class Logic - Selected Key ##################

	setSelectedKey = (key: string) => storage_SelectedKey.set(key);

	getSelectedKey = () => storage_SelectedKey.get();

	resetSelectedKey = () => storage_SelectedKey.delete();

	// ################## Class Logic - Panel Collapse ##################

	setPanelCollapse = (collapse: boolean) => storage_PanelCollapse.set(collapse);

	getPanelCollapse = () => storage_PanelCollapse.get();
}

export const CosmoModule_DevManager = new CosmoModule_DevManager_Class();