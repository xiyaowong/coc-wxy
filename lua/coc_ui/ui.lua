local M = {}

---quickpick
---@param title string
---@param items string[]
---@param resolve fun(ret: number)
function M.quickpick(title, items, resolve)
	vim.ui.select(items, { prompt = title }, function(_, idx)
		resolve((idx and idx - 1) or -1)
	end)
end

---input
---@param title string
---@param default nil|string
---@param resolve fun(ret: string|nil)
function M.input(title, default, resolve)
	vim.ui.input({ prompt = title, default = default }, function(text)
		resolve(text)
	end)
end

--- Display a notification to the user.
--- @param msg string Content of the notification to show to the user.
--- @param level number|nil One of the values from `vim.log.levels`.
--- @param opts table|nil Optional parameters. Unused by default.
function M.notify(msg, level, opts)
	return vim.notify(msg, level, opts)
end

return M
