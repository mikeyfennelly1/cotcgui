# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- set NEXT_PUBLIC_API_BASE_URL at build and runtime stages
- import TimeSeriesRecord from correct path
- remove redundant router.refresh() after group deletion
- remove use strict directive, add getGroupByName import, type groups

### Added
- add double-Shift command palette for searching groups and pages
- add Ctrl+G shortcut and tooltip to create group button
- add NATS health page at /nats
- add delete group toast, sidebar refresh, and fix exception classes
- implement delete group functionality
- add separators and extract sub-components in GroupPage
- add logging to CreateGroupSheet and createGroup integration test
- add docker build script and git hooks

### Changed
- split group page into per-component files under stream/[slug]/
- split stream-view into per-component files under stream-view/
- extract EnabledProducersList component and clean up imports
- revalidate groups cache tag on group creation
- accept groupName and producers props instead of static data
- clear home page content
- docker build script uses VERSION to push
- user image
- use revalidateTag instead of revalidatePath to prevent GroupPage re-render
- add cursor pointer to DeleteGroupButton
- add createGroup client method and sidebar sheet UI
