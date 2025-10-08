"use client";

import React, { useEffect, useState } from "react";
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Award } from "lucide-react";

interface Insight {
  id: string;
  type: "strength" | "weakness" | "recommendation" | "achievement" | "warning" | "opportunity";
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  action?: string;
}

interface AIInsightsData {
  insights: Insight[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
  predictions: {
    nextPR: string;
    plateauRisk: string;
    injuryRisk: string;
  };
}

export default function AIInsights() {
  const [insightsData, setInsightsData] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics/ai-insights");
      if (!response.ok) throw new Error("Failed to fetch AI insights");
      
      const data = await response.json();
      setInsightsData(data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setInsightsData(null);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Award className="w-5 h-5 text-green-400" />;
      case "weakness":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "recommendation":
        return <Target className="w-5 h-5 text-blue-400" />;
      case "achievement":
        return <Zap className="w-5 h-5 text-purple-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      default:
        return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "strength":
        return "border-green-500/30 bg-green-500/5";
      case "weakness":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "recommendation":
        return "border-blue-500/30 bg-blue-500/5";
      case "achievement":
        return "border-purple-500/30 bg-purple-500/5";
      case "warning":
        return "border-red-500/30 bg-red-500/5";
      case "opportunity":
        return "border-cyan-500/30 bg-cyan-500/5";
      default:
        return "border-slate-700/30 bg-slate-800/20";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded">High Priority</span>;
      case "medium":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">Medium</span>;
      case "low":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">Low</span>;
      default:
        return null;
    }
  };

  const filteredInsights = insightsData?.insights.filter((insight) => {
    if (selectedFilter === "all") return true;
    return insight.type === selectedFilter;
  }) || [];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700/50 rounded w-1/3"></div>
          <div className="h-32 bg-slate-700/50 rounded"></div>
          <div className="h-32 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!insightsData) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
        </div>
        <p className="text-gray-400 text-center py-8">
          No insights available. Complete more workouts for AI analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
            <p className="text-sm text-gray-400">Intelligent analysis of your training data</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-6 py-3">
          <div className="text-xs text-gray-400 mb-1">Training Score</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {insightsData.overallScore}/100
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "strength", "weakness", "recommendation", "warning", "opportunity"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === filter
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === "all" && ` (${insightsData.insights.length})`}
          </button>
        ))}
      </div>

      {/* Predictions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Next PR Prediction */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-sm font-medium text-gray-400">Next PR Prediction</div>
          </div>
          <p className="text-sm text-white">{insightsData.predictions.nextPR}</p>
        </div>

        {/* Plateau Risk */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <div className="text-sm font-medium text-gray-400">Plateau Risk</div>
          </div>
          <p className="text-sm text-white">{insightsData.predictions.plateauRisk}</p>
        </div>

        {/* Injury Risk */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div className="text-sm font-medium text-gray-400">Injury Risk</div>
          </div>
          <p className="text-sm text-white">{insightsData.predictions.injuryRisk}</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No insights found for this filter.
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-lg ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{insight.category}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3 ml-8">{insight.description}</p>
              {insight.actionable && insight.action && (
                <div className="ml-8 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-1">
                    <Target className="w-3 h-3" />
                    Recommended Action
                  </div>
                  <p className="text-xs text-gray-300">{insight.action}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Strengths */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {insightsData.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-green-400 mt-1"></span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Growth Opportunities
          </h3>
          <ul className="space-y-2">
            {insightsData.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-yellow-400 mt-1"></span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="mt-6 bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <p className="text-xs text-gray-400 text-center">
           AI insights are generated based on your training patterns and should be used as guidance.
          Always consult with a fitness professional for personalized advice.
        </p>
      </div>
    </div>
  );
}
