# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2025-11-23

- Initial release.

## [0.0.2] - 2026-01-03

### Added

- `isProto` utility to check prototype key.
- Pagination `itemsWrap` option.

### Changed

- Update `usePrimaryContentTypeSlug` to `useContentTypeSlug`.

### Removed

- Navigation `getBreadcrumbs` method.
- Method check in `serverlessPreview` and `serverlessReload`.

## [0.0.3] - 2026-01-16

### Added

- `renderMeta` utility for item meta data.

### Removed

- `isProto` utility.

### Fixed

- Silent errors in `getJson`, `getJsonFile`, async `doActions` and async `applyFilters`.
- Fire-and-forget promise in async `doActions` return.

## [0.0.4] - 2026-02-12

### Changed

- URL constructor for Contentful and WordPress fetch URLs.

### Added

- `isStringSafe` utility for prototype key check.

### Fixed

- Prototype key checks for dynamic object properties.
