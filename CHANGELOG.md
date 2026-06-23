Bootstrap Select
================

Version 5.3.1 (2026-06-23, Bootstrap 5.3.x)
===========================================

- Changed package versioning to follow the supported Bootstrap compatibility line.
- Fixed custom option icon classes so `data-bs-select-option-icon-class` works without requiring `data-bs-select-option-icon`.
- Added outside-click closing for open select dropdowns.
- Confirmed compatibility with Bootstrap 5.3.x.


Version 1.5.3 (2026-06-22, Bootstrap 5.3)
=========================================

- Updated Bootstrap compatibility target to Bootstrap 5.3.
- Reworked inserted option and optgroup handling.
- Added support for inserting populated optgroups.
- Added support for inserting disabled optgroups.
- Added support for option dividers inside inserted optgroups.
- Fixed inserted selected options so the native select state and visible input stay synchronized.
- Fixed multiple-select value getter to return selected values instead of selected text.
- Fixed multiple-select value setter so optgroups and non-option elements are skipped safely.
- Fixed sorting after inserted or removed optgroups.
- Fixed sorting when option dividers are present inside optgroups.
- Fixed toggle-all synchronization after inserting options or optgroups.
- Fixed optgroup checkbox synchronization after insert, remove, value changes, and toggle-all actions.
- Fixed disabled and readonly state handling.
- Fixed removal cleanup for inserted options and optgroups.
- Added shorthand removal by id: `remove('element-id')`.
- Fixed ARIA role attribute output.
- Fixed internal sort key handling.
- Improved change event dispatching for user-facing state changes.


Version 1.5.2 (2022-12-14, Bootstrap 5.2)
=========================================

- Added support for Bootstrap 5.2.3.
- Added function to sanitize HTML comments in options.
- Added form-outline style for input and textarea.
- Added checkbox to toggle all options in multiple selects.
- Added option divider.
- Fixed outline style.
- Fixed missing form-control on search input.
- Fixed typo in comment.


Version 1.5.1 (2022-11-22, Bootstrap 5.2)
=========================================

- First release.
