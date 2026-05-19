export type RevisionStatus = "draft" | "published" | "archived";
export type ChangeType = "create" | "update" | "publish" | "rollback";

export type ContentBlock = {
  id: string;
  key: string;
  page: string;
  type: string;
  value: unknown;
  status: "published";
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentRevision = {
  id: string;
  contentBlockId: string;
  saveBatchId: string | null;
  versionNumber: number;
  previousValue: unknown;
  newValue: unknown;
  changeType: ChangeType;
  status: RevisionStatus;
  changeSummary: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  expiresAt: Date | null;
  isProtected: boolean;
};

export type SaveBatchRevisionItem = ContentRevision & {
  blockKey: string;
  blockPage: string;
};

export type RevisionSaveGroup = {
  saveId: string;
  createdAt: Date;
  createdBy: string | null;
  totalChanges: number;
  draftCount: number;
  publishedCount: number;
  archivedCount: number;
  items: SaveBatchRevisionItem[];
};
