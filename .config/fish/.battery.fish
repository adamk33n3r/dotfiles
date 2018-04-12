
# osx
if test (uname) = "Darwin"
    set current_capacity (ioreg -rc AppleSmartBattery 2>/dev/null | grep CurrentCapacity | awk -F' ' '{print $NF}')
    set battery_capacity (ioreg -rc AppleSmartBattery 2>/dev/null | grep MaxCapacity | awk -F' ' '{print $NF}')
    set -U LAST_BATTERY_LEVEL (math $current_capacity \* 100 \/ $battery_capacity)
end

# linux
for possible_battery_dir in /sys/class/power_supply/BAT*
    if begin; test -d "$possible_battery_dir"; and test -f "$possible_battery_dir/energy_full"; and test -f "$possible_battery_dir/energy_now"; end
        set current_capacity (cat "$possible_battery_dir/energy_now")
        set battery_capacity (cat "$possible_battery_dir/energy_full")
        set -U LAST_BATTERY_LEVEL (math $current_capacity \* 100 \/ $battery_capacity)
    end
end
