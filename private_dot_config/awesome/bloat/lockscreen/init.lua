local awful = require("awful")

local lock_screen = {}

lock_screen.init = function()
    lock_screen.authenticate = function(password)
        return password == "awesomewm"
    end

    require("bloat.lockscreen.lockscreen")
end

return lock_screen
