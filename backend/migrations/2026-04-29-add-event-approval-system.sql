-- Add approval system to organization events
ALTER TABLE organization_events
ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER status,
ADD COLUMN approved_by INT NULL AFTER approval_status,
ADD COLUMN approval_date DATETIME NULL AFTER approved_by,
ADD COLUMN rejection_reason TEXT NULL AFTER approval_date,
ADD CONSTRAINT fk_event_approved_by FOREIGN KEY (approved_by) REFERENCES deans(dean_id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX idx_approval_status ON organization_events(approval_status);
