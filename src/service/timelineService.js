const { Timeline } = require('../database');
const { subtractDayFromDate } = require('../utils/utils');

/**
 * Fetches all timeline data from database
 * @param {object} from starting date
 * @param {object} to end date
 * @return {array} timeline data
 */
const getTimelines = async (from, to) => {
    const query = from && to ? { date: { $gte: from, $lte: to } } : {};
    try {
        const data = await Timeline.find(query).select('-_id');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get timeline by date
 * @param {date} date
 * @returns {object} Returns Timeline object
 */
const getTimelineByDate = async (date) => {
    try {
        const timeline = await Timeline.findOne({ date }).select('-_id');
        return timeline;
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new timeline
 * @param {object} previousTimeline Previously saved timeline
 * @param {object} previousTotal previous new totals
 */
const createTimeline = async (previousTimeline, previousTotals) => {
    let newTimeline = {};
    newTimeline['dailyConfirmed'] =
        previousTotals.confirmedCases - previousTimeline.totalConfirmed;
    newTimeline['dailyDeceased'] =
        previousTotals.death - previousTimeline.totalDeath;
    newTimeline['dailyRecovered'] =
        previousTotals.discharged - previousTimeline.totalDischarged;
    newTimeline['date'] = subtractDayFromDate(1);
    newTimeline['totalConfirmed'] = previousTotals.confirmedCases;
    newTimeline['totalDeath'] = previousTotals.death;
    newTimeline['totalDischarged'] = previousTotals.discharged;
    try {
        const data = await new Timeline(newTimeline).save();
        return data;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getTimelines,
    getTimelineByDate,
    createTimeline,
};
