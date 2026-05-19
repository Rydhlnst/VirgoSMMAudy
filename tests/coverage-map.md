# Test Coverage Map - CMS Image Fill + Min-Item Mapping

| ID Skenario | Deskripsi | Target | Status |
|---|---|---|---|
| AC-IMG-01 | Semua field image diisi URL hasil upload tunggal | `tests/fixtures/cms-normalizer.ts#normalizeContentForImageAndMinItems` | OK Covered |
| AC-ARR-01 | Array kosong jadi minimal 1 item valid | `tests/fixtures/cms-normalizer.ts#normalizeContentForImageAndMinItems` | OK Covered |
| AC-ARR-02 | Existing item tetap dipertahankan | `tests/unit/cms-content-normalizer.test.ts` | OK Covered |
| AC-API-01 | Upload `.webp` sukses + URL valid | `app/api/admin/cms/uploads/image/route.ts#POST` | OK Covered |
| AC-API-02 | Non-image ditolak status 400 | `app/api/admin/cms/uploads/image/route.ts#POST` | OK Covered |
| AC-API-03 | Image >10MB ditolak status 413 | `app/api/admin/cms/uploads/image/route.ts#POST` | OK Covered |
| AC-SAVE-01 | PATCH save konten normalized sukses | `app/api/admin/cms/pages/[slug]/route.ts#PATCH` | OK Covered |
| AC-UI-01 | Smoke UI save + reload persisten | `Manual smoke via local admin page` | OK Covered |

## Success Index
- Total skenario PRD: 8
- Ter-cover: 8
- Success Index: 100%
