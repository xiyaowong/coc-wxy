local M = {}

local CocAction = vim.fn.CocAction

local function report_result(command_id, result)
	CocAction("runCommand", command_id, result)
end

---quickpick
---@param title string
---@param items string[]
---@param command_id string
function M.quickpick(title, items, command_id)
	vim.ui.select(items, { prompt = title }, function(_, idx)
		report_result(command_id, (idx and idx - 1) or -1)
	end)
end

function M.input(title, default, command_id)
	vim.ui.input({ prompt = title, default = default }, function(text)
		report_result(command_id, text)
	end)
end

return M
