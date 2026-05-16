# Officer Dropdown Fix

## Issue
In the "Add Officer" modal, the "Reports To (Supervisor)" dropdown was showing ALL active members, including regular members from the organization population. This was incorrect because officers should only report to other officers, not to regular members.

## Root Cause
The `getPotentialSupervisors()` function in `organization-members.ts` was filtering members based only on:
1. Active status
2. Not being the currently selected member (to prevent self-reporting)

It was NOT filtering out members with position "Member".

## Solution
Updated the `getPotentialSupervisors()` function to exclude members with position "Member":

```typescript
getPotentialSupervisors(): OrganizationMember[] {
  return this.members().filter(
    (m) =>
      m.is_active &&
      m.position.toLowerCase() !== 'member' && // ← Added this filter
      (!this.selectedMember() || m.member_id !== this.selectedMember()?.member_id),
  );
}
```

## Impact
- ✅ "Add Officer" modal now only shows officers in the "Reports To" dropdown
- ✅ "Edit Officer" modal also benefits from this fix
- ✅ Regular members are excluded from the supervisor selection
- ✅ Officers can only report to other officers or be top-level (no supervisor)

## Files Modified
- `client/src/app/features/organization/members/organization-members.ts`

## Testing
1. Navigate to Organization Members → Officers Profile
2. Click "Add Officer"
3. Check the "Reports To (Supervisor)" dropdown
4. Verify that only officers appear in the list (no regular members)
5. Verify that the dropdown shows officer positions (President, Vice President, Secretary, etc.)
6. Verify that "Member" position does not appear in the dropdown

## Related Functions
The following functions already had correct filtering:
- `getOfficers()` - Already filters out "member" position
- `getPresident()` - Correctly finds president by position name
- `loadMembers()` - Correctly filters based on view mode (list vs officers)
