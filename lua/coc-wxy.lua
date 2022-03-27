local M = {}

local CocAction = vim.fn.CocAction

---quickpick
---@param title string
---@param items string[]
---@param command_id string
function M.quickpick(title, items, command_id)
	vim.ui.select(items, { prompt = title }, function(_, idx)
		CocAction("runCommand", command_id, (idx and idx - 1) or -1)
	end)
end

function M.input(title, default, command_id)
	vim.ui.input({ prompt = title, default = default }, function(text)
		CocAction("runCommand", command_id, text)
	end)
end

return M
