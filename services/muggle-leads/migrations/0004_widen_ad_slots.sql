UPDATE ad_slots
SET default_width = 'clamp(240px, 22vw, 420px)',
    updated_at = '2026-06-08T00:00:00.000Z'
WHERE project_id = 'codex-session-patcher'
  AND default_width = 'clamp(190px, 17vw, 320px)';

UPDATE ad_campaigns
SET width = 'clamp(240px, 22vw, 420px)',
    updated_at = '2026-06-08T00:00:00.000Z'
WHERE width = 'clamp(190px, 17vw, 320px)'
  AND slot_id IN (
    SELECT id FROM ad_slots WHERE project_id = 'codex-session-patcher'
  );
