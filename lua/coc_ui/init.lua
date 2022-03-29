local M = {}

local ui = require("coc_ui.ui")

local function get_resolve(command_id)
	return function(ret)
		vim.fn.CocAction("runCommand", command_id, ret)
	end
end

---Quickpick
---@param title string
---@param items string[]
---@param command_id string
function M.quickpick(title, items, command_id)
	ui.quickpick(title, items, get_resolve(command_id))
end

---Prompts the user for input
---@param title string
---@param default nil|string
---@param command_id string
function M.input(title, default, command_id)
	ui.input(title, default, get_resolve(command_id))
end

--- Display a notification to the user.
--- @param msg string: Content of the notification to show to the user.
--- @param level number|nil: One of the values from `vim.log.levels`.
--- @param opts table|nil: Optional parameters. Unused by default.
function M.notify(msg, level, opts)
	ui.notify(msg, level, opts)
end

return M
