let app = angular
    .module('OnlineOrganizer', ['ngMaterial', 'toaster', 'ngAnimate'])
    .controller('eventDetails', function ($scope, $interval, toaster, $timeout) {
        const vm = this;
        const popup = (type, body) => toaster.pop({type, body});

        vm.events = [];
        vm.drawerOpen = false;
        vm.drawerMode = 'create';
        const today = new Date().toISOString().split('T')[0];
        vm.activeDate = today;
        vm.form = {name: '', date: today, time: new Date().toTimeString().slice(0, 5)};
        vm.selectedDayEvents = [];
        vm.countdown = {rDays: 0, rHours: 0, rMinutes: 0, rSeconds: 0};

        const parseToDate = (dateStr, timeStr) => new Date(`${dateStr}T${timeStr}:00`);
        const formatTime = date => date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});

        const updateNextEvent = () => {
            const now = Date.now();
            const upcoming = vm.events.filter(ev => parseToDate(ev.date, ev.time) > now).sort((a, b) => parseToDate(a.date, a.time) - parseToDate(b.date, b.time));
            vm.nextEvent = upcoming[0];
            if (vm.nextEvent) {
                const diff = parseToDate(vm.nextEvent.date, vm.nextEvent.time) - now;
                vm.countdown.rSeconds = Math.floor((diff / 1000) % 60);
                vm.countdown.rMinutes = Math.floor((diff / 1000 / 60) % 60);
                vm.countdown.rHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                vm.countdown.rDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                if (diff <= 0) {
                    popup('warning', `Event: ${vm.nextEvent.name} is overdue`);
                    vm.deleteEvent(vm.nextEvent.id);
                }
            } else {
                vm.countdown = {rDays: 0, rHours: 0, rMinutes: 0, rSeconds: 0};
            }
        };

        $interval(updateNextEvent, 1000);

        vm.saveEvents = () => { // stub for persistence in future
        };

        vm.loadEventsForDate = date => vm.selectedDayEvents = vm.events.filter(ev => ev.date === date);

        vm.deleteEvent = id => {
            vm.events = vm.events.filter(ev => ev.id !== id);
            popup('success', 'Event deleted successfully');
            vm.loadEventsForDate(vm.activeDate ?? vm.form.date);
            updateNextEvent();
            if (vm.calendar) {
                vm.calendar.removeAllEvents();
                vm.calendar.refetchEvents();
            }
        };

        vm.openEventDrawer = (mode, event) => {
            vm.drawerMode = mode;
            vm.drawerOpen = true;
            if (mode === 'edit' && event) {
                vm.form = {name: event.name, date: event.date, time: event.time, id: event.id};
            } else {
                vm.form = {name: '', date: vm.activeDate ?? new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5)};
            }
        };

        vm.closeDrawer = () => vm.drawerOpen = false;

        vm.submitEvent = () => {
            const target = parseToDate(vm.form.date, vm.form.time);
            if (target <= Date.now()) {
                popup('error', 'Please choose a future date/time.');
                return;
            }
            if (vm.drawerMode === 'edit') {
                vm.events = vm.events.map(ev => ev.id === vm.form.id ? {...ev, name: vm.form.name, date: vm.form.date, time: vm.form.time} : ev);
                popup('success', 'Event updated successfully');
            } else {
                vm.events.push({id: Date.now(), name: vm.form.name, date: vm.form.date, time: vm.form.time});
                popup('success', 'Event added successfully');
            }
            vm.loadEventsForDate(vm.activeDate ?? vm.form.date);
            vm.closeDrawer();
            updateNextEvent();
            if (vm.calendar) vm.calendar.refetchEvents();
        };

        const initCalendar = () => {
            const calendarEl = document.getElementById('calendar');
            vm.calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                themeSystem: 'standard',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                dateClick: info => {
                    vm.activeDate = info.dateStr;
                    vm.loadEventsForDate(info.dateStr);
                    $scope.$applyAsync(() => vm.openEventDrawer('create'));
                },
                eventClick: info => {
                    const event = info.event.extendedProps.helpers;
                    vm.activeDate = event.date;
                    vm.loadEventsForDate(event.date);
                    $scope.$applyAsync(() => vm.openEventDrawer('edit', event));
                },
                events: info => {
                    $scope.$applyAsync(() => info.success(vm.events.map(ev => ({
                        id: ev.id,
                        title: ev.name,
                        start: `${ev.date}T${ev.time}`,
                        extendedProps: {helpers: ev}
                    }))));
                },
                selectable: true
            });
            vm.calendar.render();
        };

        $timeout(initCalendar);
    });
