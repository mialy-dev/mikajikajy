import React, { useState } from "react";
import api from "../lib/api";

export default function LicenceActivationPage() {
    const [licenceKey, setLicenceKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleActivation = async (e) => {
        e.preventDefault();

        if (!licenceKey.trim()) {
            setSuccess(false);
            setMessage("Veuillez saisir votre clé de licence.");
            return;
        }

        setLoading(true);
        setMessage("");
        setSuccess(false);

        try {
            const { data } = await api.post("/licence/activate", {
                licenceKey: licenceKey.trim(),
            });

            setSuccess(true);
            setMessage(data.message || "Licence activée avec succès !");
        } catch (error) {
            setSuccess(false);
            setMessage(
                error.response?.data?.message ||
                    "Erreur de connexion au serveur."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        E-KAJY
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Activation de votre licence
                    </p>
                </div>

                <form onSubmit={handleActivation}>
                    <label className="mb-2 block font-medium text-gray-700">
                        Clé de licence
                    </label>

                    <input
                        type="text"
                        value={licenceKey}
                        onChange={(e) => setLicenceKey(e.target.value)}
                        placeholder="Exemple : EKAJY-XXXX-XXXX"
                        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                    />

                    {message && (
                        <p
                            className={`mt-4 text-sm ${
                                success ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Activation..." : "Activer ma licence"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    E-KAJY — Gestion et archivage des projets
                </p>
            </div>
        </div>
    );
}