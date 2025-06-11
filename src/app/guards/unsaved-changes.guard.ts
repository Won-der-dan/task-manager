import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // Check if component exists
  if (!component) {
    return true;
  }

  if (!component.canDeactivate()) {
    return confirm('You have unsaved changes. Do you really want to leave?')
  }
  return true;
};
